# ============================================================
# CROP ROTATION GUIDANCE
# ============================================================
#
# IMPORTANT:
#
# This service is RULE-BASED AGRONOMIC GUIDANCE.
#
# It is NOT:
# - an ML prediction
# - a laboratory soil analysis
# - a guarantee that a crop will perform well
#
# Final crop rotation should also consider:
# - season
# - local climate
# - soil condition
# - irrigation availability
# - previous disease/pest history
# - nutrient status
# - local agricultural recommendations
#
# ============================================================


CROP_ROTATION_GUIDE = {

    # ========================================================
    # RICE
    # ========================================================

    "rice": {
        "summary": (
            "Rice is a cereal crop that can remove substantial nutrients "
            "from the soil and is often grown under high-moisture conditions. "
            "Following rice with a legume or a crop with different water and "
            "rooting requirements can improve crop-family diversity, nutrient "
            "cycling and overall rotation balance."
        ),

        "next_crops": [
            {
                "crop": "chickpea",

                "reason": (
                    "Chickpea is a legume and can form a symbiotic relationship "
                    "with nitrogen-fixing Rhizobium bacteria. When nodulation is "
                    "effective, the crop can obtain part of its nitrogen requirement "
                    "from atmospheric nitrogen. Its roots and crop residues can also "
                    "contribute organic material and recycled nutrients after harvest. "
                    "Moving from rice to chickpea also changes the crop family and "
                    "reduces repeated cereal cultivation."
                ),
            },

            {
                "crop": "lentil",

                "reason": (
                    "Lentil introduces a pulse crop after rice. As a legume, it can "
                    "support biological nitrogen fixation when properly nodulated. "
                    "Its different rooting pattern and residue characteristics increase "
                    "rotation diversity and may contribute organic material and nitrogen "
                    "to the following cropping cycle."
                ),
            },

            {
                "crop": "maize",

                "reason": (
                    "Maize provides a different cereal production system from rice. "
                    "It generally uses different water management and rooting conditions, "
                    "which can help diversify fields that are repeatedly managed for rice. "
                    "This option is most suitable where season, drainage and water "
                    "availability support maize cultivation."
                ),
            },
        ],
    },


    # ========================================================
    # MAIZE
    # ========================================================

    "maize": {
        "summary": (
            "Maize is a cereal with relatively high nutrient demand, especially "
            "nitrogen. Following maize with a pulse crop can introduce biological "
            "nitrogen fixation, diversify root systems and provide a break from "
            "continuous cereal cultivation."
        ),

        "next_crops": [
            {
                "crop": "chickpea",

                "reason": (
                    "Chickpea is a legume capable of biological nitrogen fixation "
                    "through its association with Rhizobium bacteria. After a "
                    "nitrogen-demanding crop such as maize, chickpea provides a "
                    "different nutrient-use pattern. Its roots and residues can "
                    "contribute organic matter and recycled nutrients, while the "
                    "change from cereal to pulse also improves crop-family diversity."
                ),
            },

            {
                "crop": "lentil",

                "reason": (
                    "Lentil is a pulse crop that can fix atmospheric nitrogen when "
                    "effective nodulation occurs. It introduces a different root system "
                    "and crop family after maize. Decomposition of roots and residues "
                    "can contribute organic material and nutrients, while the cereal-to-"
                    "legume rotation can help reduce problems associated with repeated "
                    "cropping of similar plants."
                ),
            },

            {
                "crop": "blackgram",

                "reason": (
                    "Blackgram is a legume and can support biological nitrogen fixation. "
                    "It can provide a useful crop-family break after maize and introduce "
                    "a different rooting pattern and nutrient requirement. Its crop "
                    "residues can return organic material to the soil when retained "
                    "after harvest."
                ),
            },
        ],
    },


    # ========================================================
    # CHICKPEA
    # ========================================================

    "chickpea": {
        "summary": (
            "Chickpea is already a legume, so the following crop should preferably "
            "come from another botanical family. A cereal or other non-legume can "
            "make use of nutrients released from decomposing legume residues while "
            "avoiding continuous pulse cultivation."
        ),

        "next_crops": [
            {
                "crop": "maize",

                "reason": (
                    "Maize is a cereal with relatively high nitrogen demand. Following "
                    "chickpea, maize may benefit from nitrogen and other nutrients "
                    "released as chickpea roots and residues decompose. The change "
                    "from legume to cereal also creates a strong botanical rotation "
                    "and introduces different rooting and nutrient-use patterns."
                ),
            },

            {
                "crop": "rice",

                "reason": (
                    "Rice provides a major crop-family and management change after "
                    "chickpea. Where irrigation and field conditions permit rice "
                    "production, the cereal phase can make use of residual nutrients "
                    "while avoiding repeated pulse cultivation."
                ),
            },

            {
                "crop": "cotton",

                "reason": (
                    "Cotton is a non-legume with a different root system, crop duration "
                    "and nutrient requirement from chickpea. This provides crop-family "
                    "diversity and helps prevent continuous cultivation of pulses in "
                    "the same field."
                ),
            },
        ],
    },


    # ========================================================
    # KIDNEY BEANS
    # ========================================================

    "kidneybeans": {
        "summary": (
            "Kidney bean is a legume. Following it with a cereal or another "
            "non-legume helps diversify nutrient demand, root systems and crop "
            "families while avoiding repeated legume cultivation."
        ),

        "next_crops": [
            {
                "crop": "maize",

                "reason": (
                    "Maize provides a cereal phase after kidney beans. Its higher "
                    "nitrogen demand can make use of nutrients released from previous "
                    "legume residues, while the change in crop family and root structure "
                    "improves rotation diversity."
                ),
            },

            {
                "crop": "rice",

                "reason": (
                    "Rice provides a different cereal and water-management system after "
                    "kidney beans. Where soil and irrigation conditions permit, this "
                    "rotation creates a major change from pulse cultivation and may "
                    "help use residual nutrients from the previous crop."
                ),
            },

            {
                "crop": "cotton",

                "reason": (
                    "Cotton provides a non-legume phase with different rooting depth, "
                    "nutrient demand and crop duration. This helps diversify the field "
                    "after a kidney bean crop."
                ),
            },
        ],
    },


    # ========================================================
    # PIGEONPEA
    # ========================================================

    "pigeonpeas": {
        "summary": (
            "Pigeonpea is a legume with a relatively deep root system. After a "
            "pigeonpea crop, cereals or other non-legumes can provide a useful "
            "crop-family change and utilize nutrients recycled through previous "
            "root and residue decomposition."
        ),

        "next_crops": [
            {
                "crop": "maize",

                "reason": (
                    "Maize is a cereal and provides a strong botanical contrast to "
                    "pigeonpea. The maize crop may benefit from nutrient release from "
                    "decomposing pigeonpea residues while introducing a different "
                    "rooting and nutrient-use pattern."
                ),
            },

            {
                "crop": "rice",

                "reason": (
                    "Rice introduces a cereal phase after pigeonpea. Where field "
                    "water availability permits, the change in crop family and "
                    "production environment can improve overall rotation diversity."
                ),
            },

            {
                "crop": "cotton",

                "reason": (
                    "Cotton is a non-legume crop with different nutrient requirements "
                    "and crop duration. Following pigeonpea with cotton avoids repeated "
                    "pulse cultivation and increases crop-family diversity."
                ),
            },
        ],
    },


    # ========================================================
    # MOTH BEAN
    # ========================================================

    "mothbeans": {
        "summary": (
            "Moth bean is a drought-tolerant legume. A cereal or another non-legume "
            "is generally a useful next crop because it provides a crop-family change "
            "and can benefit from nutrient cycling associated with the previous pulse."
        ),

        "next_crops": [
            {
                "crop": "maize",

                "reason": (
                    "Maize introduces a cereal crop after moth bean. This creates "
                    "crop-family diversity and allows a relatively nitrogen-demanding "
                    "crop to follow a legume phase."
                ),
            },

            {
                "crop": "cotton",

                "reason": (
                    "Cotton has a different rooting pattern and nutrient demand from "
                    "moth bean. It therefore provides a useful non-legume rotation "
                    "where local soil, water and climate conditions support cotton."
                ),
            },

            {
                "crop": "millet",

                "reason": (
                    "Millet is a cereal and can be suitable in relatively dry environments. "
                    "Following a legume with millet provides crop-family diversity and "
                    "different nutrient and rooting characteristics."
                ),
            },
        ],
    },


    # ========================================================
    # MUNGBEAN
    # ========================================================

    "mungbean": {
        "summary": (
            "Mungbean is a short-duration legume capable of biological nitrogen "
            "fixation. Following it with cereals or other non-legumes creates a "
            "more balanced rotation and can allow subsequent crops to benefit from "
            "nutrient cycling from mungbean roots and residues."
        ),

        "next_crops": [
            {
                "crop": "maize",

                "reason": (
                    "Maize has relatively high nitrogen demand and provides a cereal "
                    "phase after mungbean. It may benefit from nitrogen mineralized "
                    "from mungbean residues while the crop-family change improves "
                    "rotation diversity."
                ),
            },

            {
                "crop": "rice",

                "reason": (
                    "Rice provides a cereal phase and major management change after "
                    "mungbean. Where irrigation is available, rice can follow the "
                    "legume phase while making use of residual nutrients."
                ),
            },

            {
                "crop": "cotton",

                "reason": (
                    "Cotton provides a non-legume crop with different rooting depth, "
                    "duration and nutrient demand. This makes it useful for diversifying "
                    "a field following mungbean."
                ),
            },
        ],
    },


    # ========================================================
    # BLACKGRAM
    # ========================================================

    "blackgram": {
        "summary": (
            "Blackgram is a pulse crop that can support biological nitrogen fixation. "
            "The following crop is preferably a cereal or another non-legume so that "
            "the rotation changes crop family, rooting characteristics and nutrient demand."
        ),

        "next_crops": [
            {
                "crop": "maize",

                "reason": (
                    "Maize introduces a nitrogen-demanding cereal after blackgram. "
                    "It may benefit from nutrients released as blackgram roots and "
                    "residues decompose, while the pulse-to-cereal sequence creates "
                    "useful botanical diversity."
                ),
            },

            {
                "crop": "rice",

                "reason": (
                    "Rice provides a cereal phase after blackgram. Where water and "
                    "soil conditions are appropriate, this rotation changes crop family "
                    "and allows a different water-management system."
                ),
            },

            {
                "crop": "cotton",

                "reason": (
                    "Cotton introduces a non-legume crop with different nutrient "
                    "requirements and rooting characteristics, reducing repeated "
                    "pulse cultivation."
                ),
            },
        ],
    },


    # ========================================================
    # LENTIL
    # ========================================================

    "lentil": {
        "summary": (
            "Lentil is a legume and can support biological nitrogen fixation. "
            "Following lentil with a cereal or another non-legume can make use of "
            "nutrient cycling from the legume phase while increasing crop-family diversity."
        ),

        "next_crops": [
            {
                "crop": "maize",

                "reason": (
                    "Maize has relatively high nitrogen demand and provides a cereal "
                    "phase after lentil. Nitrogen and other nutrients released from "
                    "decomposing lentil roots and residues may contribute to the "
                    "following crop."
                ),
            },

            {
                "crop": "rice",

                "reason": (
                    "Rice provides a different cereal production system after lentil. "
                    "Where irrigation and field conditions support rice, it can create "
                    "a strong crop-family and management change."
                ),
            },

            {
                "crop": "cotton",

                "reason": (
                    "Cotton provides a non-legume crop with different nutrient demand "
                    "and rooting depth. It diversifies the rotation after a lentil crop."
                ),
            },
        ],
    },


    # ========================================================
    # COTTON
    # ========================================================

    "cotton": {
        "summary": (
            "Cotton is a relatively long-duration crop with substantial nutrient "
            "requirements. Following cotton with a pulse can introduce biological "
            "nitrogen fixation, different rooting characteristics and a useful "
            "botanical break."
        ),

        "next_crops": [
            {
                "crop": "chickpea",

                "reason": (
                    "Chickpea introduces a legume phase after cotton. Effective nodulation "
                    "can support biological nitrogen fixation, while chickpea roots and "
                    "residue can contribute organic material and recycled nutrients to "
                    "the soil."
                ),
            },

            {
                "crop": "lentil",

                "reason": (
                    "Lentil provides a pulse crop with different rooting characteristics "
                    "and nutrient demand from cotton. Its legume phase can contribute to "
                    "nitrogen cycling while increasing crop-family diversity."
                ),
            },

            {
                "crop": "mungbean",

                "reason": (
                    "Mungbean is a relatively short-duration legume that can fit between "
                    "longer crop cycles where season permits. It can support biological "
                    "nitrogen fixation and return root and residue biomass to the soil."
                ),
            },
        ],
    },


    # ========================================================
    # JUTE
    # ========================================================

    "jute": {
        "summary": (
            "After jute, rotating to a cereal or pulse changes nutrient demand, "
            "rooting behavior and crop family. A legume can additionally introduce "
            "biological nitrogen fixation into the sequence."
        ),

        "next_crops": [
            {
                "crop": "rice",

                "reason": (
                    "Rice can follow jute where season, soil and irrigation conditions "
                    "support paddy cultivation. The change in growth pattern and management "
                    "helps diversify the field after jute."
                ),
            },

            {
                "crop": "lentil",

                "reason": (
                    "Lentil introduces a nitrogen-fixing pulse after jute. Effective "
                    "nodulation can support biological nitrogen fixation, while roots "
                    "and residue contribute organic material after decomposition."
                ),
            },

            {
                "crop": "chickpea",

                "reason": (
                    "Chickpea provides a legume phase after jute. It introduces different "
                    "rooting and nutrient requirements and may contribute biologically "
                    "fixed nitrogen and organic residue to the cropping system."
                ),
            },
        ],
    },


    # ========================================================
    # WATERMELON
    # ========================================================

    "watermelon": {
        "summary": (
            "Watermelon belongs to the cucurbit family. Repeated cucurbit cultivation "
            "can maintain similar pest, disease and nutrient-use patterns, so a crop "
            "from another family is preferable in the following cycle."
        ),

        "next_crops": [
            {
                "crop": "chickpea",

                "reason": (
                    "Chickpea introduces a legume phase after watermelon. It changes "
                    "crop family and rooting pattern and can support biological nitrogen "
                    "fixation when nodulation is effective."
                ),
            },

            {
                "crop": "maize",

                "reason": (
                    "Maize provides a cereal rotation after a cucurbit. The different "
                    "root architecture, crop family and nutrient demand increase field "
                    "diversity and avoid continuous cucurbit production."
                ),
            },

            {
                "crop": "lentil",

                "reason": (
                    "Lentil provides a pulse rotation and crop-family break after watermelon. "
                    "It can contribute to nitrogen cycling and introduces a different "
                    "rooting and residue pattern."
                ),
            },
        ],
    },


    # ========================================================
    # MUSKMELON
    # ========================================================

    "muskmelon": {
        "summary": (
            "Muskmelon is a cucurbit crop. Rotating away from cucurbits in the "
            "following cycle can help diversify pest, disease, root and nutrient patterns."
        ),

        "next_crops": [
            {
                "crop": "chickpea",

                "reason": (
                    "Chickpea provides a legume phase after muskmelon, creating a strong "
                    "crop-family break while supporting biological nitrogen fixation "
                    "under suitable nodulation conditions."
                ),
            },

            {
                "crop": "maize",

                "reason": (
                    "Maize introduces a cereal with a very different root system and "
                    "nutrient requirement from muskmelon, providing useful rotation diversity."
                ),
            },

            {
                "crop": "lentil",

                "reason": (
                    "Lentil introduces a pulse crop after a cucurbit. This provides "
                    "crop-family diversity and can support nutrient cycling through "
                    "legume residues and biological nitrogen fixation."
                ),
            },
        ],
    },


    # ========================================================
    # BANANA
    # ========================================================

    "banana": {
        "summary": (
            "Banana is commonly grown for a relatively long production cycle. "
            "After removing an old banana stand, changing crop family can diversify "
            "nutrient demand and rooting patterns before another intensive crop cycle."
        ),

        "next_crops": [
            {
                "crop": "mungbean",

                "reason": (
                    "Mungbean is a short-duration legume that can provide a different "
                    "crop family after banana. It can support biological nitrogen fixation "
                    "and contribute root and residue biomass where climate and season permit."
                ),
            },

            {
                "crop": "blackgram",

                "reason": (
                    "Blackgram introduces a pulse phase with different nutrient demand "
                    "and rooting characteristics. Its residue can contribute organic "
                    "material while providing a break from banana cultivation."
                ),
            },

            {
                "crop": "maize",

                "reason": (
                    "Maize provides a cereal phase after banana with different crop "
                    "architecture, root distribution and management requirements. "
                    "Suitability depends strongly on season, soil and water availability."
                ),
            },
        ],
    },


    # ========================================================
    # PAPAYA
    # ========================================================

    "papaya": {
        "summary": (
            "Papaya has a relatively long crop cycle compared with annual field crops. "
            "After removing a papaya stand, rotating to a different botanical family "
            "can diversify nutrient demand, roots and crop-management conditions."
        ),

        "next_crops": [
            {
                "crop": "mungbean",

                "reason": (
                    "Mungbean provides a short-duration legume phase after papaya. "
                    "It can support biological nitrogen fixation and contributes a "
                    "different root and residue pattern."
                ),
            },

            {
                "crop": "chickpea",

                "reason": (
                    "Chickpea introduces a pulse phase with different nutrient requirements "
                    "from papaya. Effective nodulation can support biological nitrogen fixation "
                    "while residues contribute organic material."
                ),
            },

            {
                "crop": "maize",

                "reason": (
                    "Maize provides a cereal phase with different rooting, nutrient "
                    "demand and crop architecture, increasing diversity after papaya."
                ),
            },
        ],
    },


    # ========================================================
    # POMEGRANATE
    # ========================================================

    "pomegranate": {
        "summary": (
            "Pomegranate is a perennial orchard crop, so normal annual crop rotation "
            "does not apply while the trees remain productive. The following suggestions "
            "should be treated as possible intercrops or ground-cover options rather than "
            "replacement crops."
        ),

        "next_crops": [
            {
                "crop": "chickpea",

                "reason": (
                    "Chickpea may provide a legume intercrop where orchard spacing, "
                    "water availability and management allow. Biological nitrogen fixation "
                    "and crop residue can contribute to nutrient cycling, but competition "
                    "with pomegranate trees for water and nutrients must be considered."
                ),
            },

            {
                "crop": "mungbean",

                "reason": (
                    "Mungbean is short-duration and may serve as a legume intercrop in "
                    "suitable orchard systems. It can provide temporary soil cover and "
                    "support biological nitrogen fixation while contributing residue biomass."
                ),
            },

            {
                "crop": "blackgram",

                "reason": (
                    "Blackgram can provide a pulse intercrop where pomegranate orchard "
                    "conditions permit. It changes the ground-level crop community and "
                    "can contribute residue and nitrogen cycling without replacing the "
                    "perennial trees."
                ),
            },
        ],
    },


    # ========================================================
    # MANGO
    # ========================================================

    "mango": {
        "summary": (
            "Mango is a perennial orchard crop. Conventional yearly crop rotation is "
            "not applicable while the orchard remains productive. These options should "
            "be considered possible intercrops or ground-cover crops."
        ),

        "next_crops": [
            {
                "crop": "mungbean",

                "reason": (
                    "Mungbean is a short-duration legume that may be grown between trees "
                    "when orchard spacing, light and water availability permit. It can "
                    "provide soil cover, biological nitrogen fixation and residue biomass."
                ),
            },

            {
                "crop": "cowpea",

                "reason": (
                    "Cowpea can function as a leguminous intercrop or ground cover in "
                    "suitable orchard systems. Its spreading canopy can protect exposed "
                    "soil while its legume association supports nitrogen fixation."
                ),
            },

            {
                "crop": "chickpea",

                "reason": (
                    "Chickpea can be considered under suitable seasonal and orchard "
                    "conditions. As a legume it may contribute to nitrogen cycling, "
                    "but competition for water and nutrients with mango trees must "
                    "be managed."
                ),
            },
        ],
    },


    # ========================================================
    # GRAPES
    # ========================================================

    "grapes": {
        "summary": (
            "Grapevines are perennial, so the field is not normally rotated annually "
            "to another main crop. Compatible cover crops or intercrops may instead "
            "be used between vineyard rows."
        ),

        "next_crops": [
            {
                "crop": "mungbean",

                "reason": (
                    "Mungbean may provide temporary legume cover where vineyard climate "
                    "and row spacing permit. Its roots and residue can contribute organic "
                    "material and nutrient cycling."
                ),
            },

            {
                "crop": "cowpea",

                "reason": (
                    "Cowpea can provide ground cover and a legume component between "
                    "vine rows where competition is properly managed. Ground cover can "
                    "also help protect exposed soil."
                ),
            },

            {
                "crop": "chickpea",

                "reason": (
                    "Chickpea may provide a cool-season legume option in compatible "
                    "vineyard systems. Biological nitrogen fixation can contribute to "
                    "nutrient cycling, but vineyard water and nutrient competition must "
                    "be considered."
                ),
            },
        ],
    },


    # ========================================================
    # APPLE
    # ========================================================

    "apple": {
        "summary": (
            "Apple is a perennial orchard crop, so annual rotation of the main crop "
            "is not practical while trees remain productive. Compatible ground covers "
            "or intercrops can instead be considered between tree rows."
        ),

        "next_crops": [
            {
                "crop": "clover",

                "reason": (
                    "Clover is a leguminous cover crop that can protect the soil surface "
                    "and support biological nitrogen fixation. It may also contribute "
                    "organic residue when mown, although competition with apple trees "
                    "must be managed."
                ),
            },

            {
                "crop": "cowpea",

                "reason": (
                    "Cowpea can provide warm-season ground cover in suitable orchard "
                    "conditions. As a legume it can contribute to nitrogen cycling and "
                    "produce residue biomass while reducing exposed soil."
                ),
            },

            {
                "crop": "mungbean",

                "reason": (
                    "Mungbean is short-duration and may be used as an intercrop where "
                    "orchard spacing and environmental conditions permit. It introduces "
                    "a legume phase and can contribute residue biomass."
                ),
            },
        ],
    },


    # ========================================================
    # ORANGE
    # ========================================================

    "orange": {
        "summary": (
            "Orange is a perennial citrus crop, so yearly crop rotation is not normally "
            "performed. Suitable intercrops or ground-cover crops can instead be used "
            "between trees where they do not create excessive competition."
        ),

        "next_crops": [
            {
                "crop": "cowpea",

                "reason": (
                    "Cowpea may serve as a leguminous ground cover in suitable citrus "
                    "orchards. It can reduce exposed soil, contribute biomass and support "
                    "biological nitrogen fixation."
                ),
            },

            {
                "crop": "mungbean",

                "reason": (
                    "Mungbean is a short-duration legume that may fit between citrus "
                    "production cycles or between tree rows where light and water permit."
                ),
            },

            {
                "crop": "chickpea",

                "reason": (
                    "Chickpea can provide a legume phase under suitable cool-season "
                    "conditions. Its compatibility depends on orchard irrigation, spacing "
                    "and competition with citrus roots."
                ),
            },
        ],
    },


    # ========================================================
    # COCONUT
    # ========================================================

    "coconut": {
        "summary": (
            "Coconut is a long-lived perennial crop, so the main crop is not normally "
            "rotated annually. Intercrops beneath the canopy may be considered depending "
            "on light availability, moisture and plantation management."
        ),

        "next_crops": [
            {
                "crop": "cowpea",

                "reason": (
                    "Cowpea can provide leguminous ground cover under suitable coconut "
                    "plantations. It contributes biomass, protects exposed soil and can "
                    "support biological nitrogen fixation."
                ),
            },

            {
                "crop": "mungbean",

                "reason": (
                    "Mungbean is short-duration and may fit as a legume intercrop where "
                    "sufficient sunlight and moisture are available between coconut palms."
                ),
            },

            {
                "crop": "blackgram",

                "reason": (
                    "Blackgram can introduce a pulse component beneath suitable plantation "
                    "conditions. Its roots and residues can contribute organic material "
                    "and nutrient cycling."
                ),
            },
        ],
    },


    # ========================================================
    # COFFEE
    # ========================================================

    "coffee": {
        "summary": (
            "Coffee is a perennial crop, so conventional annual rotation is generally "
            "not applicable. Compatible ground-cover crops or intercrops can instead "
            "help diversify the production system."
        ),

        "next_crops": [
            {
                "crop": "cowpea",

                "reason": (
                    "Cowpea is a legume that can provide ground cover and biomass where "
                    "coffee spacing and light conditions allow. Biological nitrogen fixation "
                    "can contribute to nutrient cycling, but competition with coffee plants "
                    "must be managed."
                ),
            },

            {
                "crop": "mungbean",

                "reason": (
                    "Mungbean is a relatively short-duration legume and may provide "
                    "temporary soil cover in suitable coffee systems. Residues contribute "
                    "organic material after harvest."
                ),
            },

            {
                "crop": "chickpea",

                "reason": (
                    "Chickpea may provide a seasonal legume option where temperature, "
                    "light and moisture conditions are compatible with the coffee system. "
                    "Its use should be evaluated against competition with the perennial crop."
                ),
            },
        ],
    },
}


# ============================================================
# DEFAULT ROTATION
# ============================================================

DEFAULT_ROTATION = {

    "summary": (
        "A diverse rotation generally benefits from alternating crop families, "
        "root systems, nutrient demands and residue types. The following crops are "
        "general suggestions only and should be checked against local soil, climate, "
        "season and water availability."
    ),

    "next_crops": [
        {
            "crop": "chickpea",

            "reason": (
                "Chickpea introduces a legume phase. When effective nodulation occurs, "
                "it can support biological nitrogen fixation and provide roots and crop "
                "residue that contribute to nutrient and organic matter cycling."
            ),
        },

        {
            "crop": "maize",

            "reason": (
                "Maize provides a cereal phase with different rooting characteristics "
                "and nutrient demand. It can be useful when the previous crop belongs "
                "to another botanical family."
            ),
        },

        {
            "crop": "lentil",

            "reason": (
                "Lentil introduces a pulse crop and may support biological nitrogen "
                "fixation. It also provides a different crop family, root pattern and "
                "residue profile."
            ),
        },
    ],
}


# ============================================================
# GET CROP ROTATION
# ============================================================

def get_crop_rotation(crop_name: str):
    """
    Return rule-based crop rotation guidance.

    Example output:

    {
        "summary": "...",

        "next_crops": [
            {
                "crop": "chickpea",
                "reason": "..."
            },
            {
                "crop": "lentil",
                "reason": "..."
            },
            {
                "crop": "blackgram",
                "reason": "..."
            }
        ]
    }

    IMPORTANT:
    This is agronomic rule-based guidance,
    not an ML prediction.
    """

    # Protect against accidental None values.
    if not crop_name:
        return DEFAULT_ROTATION


    crop_key = (
        str(crop_name)
        .strip()
        .lower()
    )


    guide = (
        CROP_ROTATION_GUIDE.get(
            crop_key,
            DEFAULT_ROTATION,
        )
    )


    return {
        "summary": guide["summary"],

        "next_crops": guide["next_crops"],
    }