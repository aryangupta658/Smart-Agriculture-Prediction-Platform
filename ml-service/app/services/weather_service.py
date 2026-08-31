import httpx
from datetime import date, timedelta


# =====================================================
# OPEN-METEO ENDPOINTS
# =====================================================

GEOCODING_URL = (
    "https://geocoding-api.open-meteo.com/v1/search"
)

HISTORICAL_URL = (
    "https://archive-api.open-meteo.com/v1/archive"
)


# =====================================================
# INDIA STATE ALIASES
# =====================================================

STATE_ALIASES = {
    "up": "uttar pradesh",
    "u.p.": "uttar pradesh",
    "uttar pradesh": "uttar pradesh",

    "mp": "madhya pradesh",
    "m.p.": "madhya pradesh",
    "madhya pradesh": "madhya pradesh",

    "uk": "uttarakhand",
    "uttarakhand": "uttarakhand",

    "wb": "west bengal",
    "west bengal": "west bengal",

    "tn": "tamil nadu",
    "tamil nadu": "tamil nadu",
}


def normalize_text(value):
    if not value:
        return ""

    return (
        str(value)
        .strip()
        .lower()
    )


def normalize_state(value):
    value = normalize_text(value)

    return STATE_ALIASES.get(
        value,
        value,
    )


# =====================================================
# SEARCH INDIAN LOCATION
# =====================================================

async def find_indian_location(
    city: str,
    state: str | None = None,
):
    """
    Find a city in India.

    State can optionally be provided to resolve duplicate
    city names.

    Example:

    city = Gorakhpur
    state = Uttar Pradesh
    """

    clean_city = city.strip()

    clean_state = (
        normalize_state(state)
        if state
        else ""
    )


    params = {
        "name": clean_city,

        "count": 50,

        "language": "en",

        "format": "json",

        # Restrict search to India.
        "countryCode": "IN",
    }


    async with httpx.AsyncClient(
        timeout=15.0
    ) as client:

        response = await client.get(
            GEOCODING_URL,
            params=params,
        )

        response.raise_for_status()

        data = response.json()


    results = data.get(
        "results",
        []
    )


    if not results:
        return None


    # =================================================
    # STATE PROVIDED
    # =================================================

    if clean_state:

        matching_state = []

        for location in results:

            admin1 = normalize_state(
                location.get(
                    "admin1"
                )
            )


            if admin1 == clean_state:

                matching_state.append(
                    location
                )


        if matching_state:

            # Prefer highest population result
            # when duplicate results remain.

            matching_state.sort(
                key=lambda item:
                    item.get(
                        "population",
                        0,
                    )
                    or 0,

                reverse=True,
            )


            location = (
                matching_state[0]
            )


            return {
                "name":
                    location.get(
                        "name"
                    ),

                "state":
                    location.get(
                        "admin1"
                    ),

                "district":
                    location.get(
                        "admin2"
                    ),

                "country":
                    location.get(
                        "country"
                    ),

                "latitude":
                    location.get(
                        "latitude"
                    ),

                "longitude":
                    location.get(
                        "longitude"
                    ),
            }


        # State was supplied but no match found.
        return None


    # =================================================
    # NO STATE PROVIDED
    #
    # Return all good Indian matches so frontend can
    # let the user choose instead of silently picking
    # the wrong Gorakhpur.
    # =================================================

    locations = []


    for location in results:

        locations.append({
            "name":
                location.get(
                    "name"
                ),

            "state":
                location.get(
                    "admin1"
                ),

            "district":
                location.get(
                    "admin2"
                ),

            "country":
                location.get(
                    "country"
                ),

            "latitude":
                location.get(
                    "latitude"
                ),

            "longitude":
                location.get(
                    "longitude"
                ),

            "population":
                location.get(
                    "population"
                ),
        })


    return locations


# =====================================================
# HISTORICAL RAINFALL BY COORDINATES
# =====================================================

async def get_historical_rainfall(
    latitude: float,
    longitude: float,
    days: int = 30,
):
    """
    Return historical daily rainfall / precipitation.

    days:
    7
    30
    90
    365
    """

    allowed_days = {
        7,
        30,
        90,
        365,
    }


    if days not in allowed_days:
        days = 30


    # Historical API can have a short reporting delay,
    # so use yesterday as the endpoint.

    end_date = (
        date.today()
        -
        timedelta(
            days=1
        )
    )


    start_date = (
        end_date
        -
        timedelta(
            days=days - 1
        )
    )


    params = {
        "latitude":
            latitude,

        "longitude":
            longitude,

        "start_date":
            start_date.isoformat(),

        "end_date":
            end_date.isoformat(),

        "daily":
            "precipitation_sum,rain_sum",

        "timezone":
            "Asia/Kolkata",
    }


    async with httpx.AsyncClient(
        timeout=20.0
    ) as client:

        response = await client.get(
            HISTORICAL_URL,
            params=params,
        )

        response.raise_for_status()

        data = response.json()


    daily = data.get(
        "daily",
        {}
    )


    dates = daily.get(
        "time",
        []
    )


    precipitation_values = daily.get(
        "precipitation_sum",
        []
    )


    rain_values = daily.get(
        "rain_sum",
        []
    )


    history = []


    for index, current_date in enumerate(
        dates
    ):

        precipitation = (
            precipitation_values[index]
            if index
            <
            len(
                precipitation_values
            )
            else None
        )


        rain = (
            rain_values[index]
            if index
            <
            len(
                rain_values
            )
            else None
        )


        history.append({
            "date":
                current_date,

            "precipitation_mm":
                precipitation,

            "rain_mm":
                rain,
        })


    valid_precipitation = [
        float(value)
        for value in precipitation_values
        if value is not None
    ]


    total_precipitation = round(
        sum(
            valid_precipitation
        ),
        2,
    )


    rainy_days = sum(
        1
        for value
        in valid_precipitation
        if value > 0
    )


    average_daily = round(
        (
            total_precipitation
            /
            len(
                valid_precipitation
            )
        )
        if valid_precipitation
        else 0,
        2,
    )


    maximum_daily = round(
        max(
            valid_precipitation,
            default=0,
        ),
        2,
    )


    return {
        "available": True,

        "period": {
            "days":
                days,

            "start_date":
                start_date.isoformat(),

            "end_date":
                end_date.isoformat(),
        },

        "summary": {
            "total_precipitation_mm":
                total_precipitation,

            "average_daily_mm":
                average_daily,

            "maximum_daily_mm":
                maximum_daily,

            "rainy_days":
                rainy_days,
        },

        "history":
            history,
    }