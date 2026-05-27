# ============================================================
# Biodegradable Fertilizer Alternative Service
# Smart Agriculture Prediction Platform
# ============================================================

def get_biodegradable_alternative(fertilizer_name):
    """
    Takes predicted chemical fertilizer name as input
    and returns biodegradable/organic alternative with reason.
    """

    biodegradable_alternatives = {
        "Urea": {
            "alternative": "Compost, Vermicompost, Green Manure, Azotobacter Biofertilizer",
            "reason": "Urea is mainly used to supply nitrogen. Compost, vermicompost, green manure, and Azotobacter can naturally improve nitrogen availability and soil health."
        },

        "DAP": {
            "alternative": "Bone Meal, Rock Phosphate, Phosphate Solubilizing Bacteria, Compost",
            "reason": "DAP provides nitrogen and phosphorus. Rock phosphate and phosphate solubilizing bacteria help improve phosphorus availability naturally."
        },

        "MOP": {
            "alternative": "Wood Ash, Banana Peel Compost, Seaweed Extract, Compost",
            "reason": "MOP is a potassium-rich fertilizer. Wood ash, banana peel compost, and seaweed extract can provide potassium naturally."
        },

        "SSP": {
            "alternative": "Rock Phosphate, Bone Meal, Phosphate Solubilizing Bacteria",
            "reason": "SSP provides phosphorus. Rock phosphate, bone meal, and phosphate solubilizing bacteria are natural phosphorus-supporting alternatives."
        },

        "Organic compost": {
            "alternative": "Already biodegradable",
            "reason": "Organic compost is already an eco-friendly and biodegradable soil amendment."
        },

        "0-20-20": {
            "alternative": "Rock Phosphate, Bone Meal, Wood Ash, Compost",
            "reason": "This fertilizer provides phosphorus and potassium. Rock phosphate supports phosphorus, while wood ash and compost support potassium and soil fertility."
        },

        "10-10-10": {
            "alternative": "Compost, Vermicompost, Farmyard Manure, Biofertilizer Mix",
            "reason": "This is a balanced NPK fertilizer. Compost, vermicompost, and farmyard manure can naturally improve overall soil nutrients."
        },

        "10-26-26": {
            "alternative": "Rock Phosphate, Bone Meal, Wood Ash, Vermicompost",
            "reason": "This fertilizer is rich in phosphorus and potassium. Rock phosphate and bone meal provide phosphorus, while wood ash supports potassium."
        },

        "12-32-16": {
            "alternative": "Compost, Rock Phosphate, Bone Meal, Biofertilizer Mix",
            "reason": "This fertilizer has higher phosphorus content. Organic phosphorus sources such as rock phosphate and bone meal can be used."
        },

        "14-35-14": {
            "alternative": "Rock Phosphate, Bone Meal, Compost, Vermicompost",
            "reason": "This fertilizer is phosphorus-rich. Bone meal and rock phosphate are useful biodegradable alternatives for phosphorus improvement."
        },

        "15-15-15": {
            "alternative": "Compost, Vermicompost, Farmyard Manure, Green Manure",
            "reason": "This is a balanced NPK fertilizer. Organic manures and compost can provide balanced nutrients and improve soil structure."
        },

        "17-17-17": {
            "alternative": "Compost, Vermicompost, Farmyard Manure, Biofertilizer Mix",
            "reason": "This balanced fertilizer can be replaced partially with compost, vermicompost, and biofertilizers to improve natural soil fertility."
        },

        "19-19-19": {
            "alternative": "Compost, Vermicompost, Farmyard Manure, Seaweed Extract",
            "reason": "This is a balanced fertilizer. Organic manure, compost, and seaweed extract can support balanced nutrient availability."
        },

        "20-10-10": {
            "alternative": "Green Manure, Vermicompost, Azotobacter Biofertilizer, Compost",
            "reason": "This fertilizer has higher nitrogen content. Green manure, vermicompost, and nitrogen-fixing biofertilizers can naturally improve nitrogen."
        },

        "20-10-20": {
            "alternative": "Compost, Vermicompost, Green Manure, Wood Ash",
            "reason": "This fertilizer provides nitrogen and potassium. Green manure supports nitrogen, while wood ash supports potassium."
        },

        "20-20-20": {
            "alternative": "Compost, Vermicompost, Farmyard Manure, Biofertilizer Mix",
            "reason": "This is a balanced fertilizer. Compost and vermicompost can naturally improve nitrogen, phosphorus, and potassium availability."
        },

        "20-30-20": {
            "alternative": "Rock Phosphate, Bone Meal, Compost, Vermicompost",
            "reason": "This fertilizer has higher phosphorus content. Rock phosphate and bone meal are suitable organic phosphorus alternatives."
        },

        "20-40-20": {
            "alternative": "Rock Phosphate, Bone Meal, Compost, Phosphate Solubilizing Bacteria",
            "reason": "This fertilizer is phosphorus-rich. Organic phosphorus sources and phosphate solubilizing bacteria can improve phosphorus availability."
        },

        "30-10-10": {
            "alternative": "Green Manure, Vermicompost, Azotobacter, Compost",
            "reason": "This fertilizer is nitrogen-rich. Green manure and Azotobacter biofertilizer can naturally improve nitrogen availability."
        },

        "30-15-15": {
            "alternative": "Compost, Vermicompost, Green Manure, Farmyard Manure",
            "reason": "This fertilizer has higher nitrogen with balanced phosphorus and potassium. Organic manure and compost can support overall soil nutrients."
        },

        "30-20-20": {
            "alternative": "Green Manure, Compost, Vermicompost, Biofertilizer Mix",
            "reason": "This fertilizer has higher nitrogen. Green manure and compost help improve nitrogen and overall soil health."
        },

        "40-20-20": {
            "alternative": "Green Manure, Azotobacter, Vermicompost, Compost",
            "reason": "This fertilizer is nitrogen-dominant. Nitrogen-fixing biofertilizers and green manure can be used as eco-friendly alternatives."
        },

        "40-30-30": {
            "alternative": "Green Manure, Rock Phosphate, Wood Ash, Compost",
            "reason": "This fertilizer has high NPK content. A combination of green manure, rock phosphate, wood ash, and compost can naturally support soil nutrients."
        },

        "40-40-40": {
            "alternative": "Compost, Vermicompost, Farmyard Manure, Biofertilizer Mix",
            "reason": "This is a high balanced NPK fertilizer. Organic manure, compost, and biofertilizers can improve nutrient availability more sustainably."
        },

        "50-25-25": {
            "alternative": "Green Manure, Azotobacter, Compost, Vermicompost",
            "reason": "This fertilizer is nitrogen-rich. Green manure and Azotobacter can support nitrogen naturally, while compost improves soil structure."
        },

        "60-20-20": {
            "alternative": "Green Manure, Azotobacter Biofertilizer, Vermicompost",
            "reason": "This fertilizer has very high nitrogen content. Nitrogen-fixing biofertilizers and green manure are suitable biodegradable alternatives."
        },

        "60-30-30": {
            "alternative": "Green Manure, Compost, Vermicompost, Biofertilizer Mix",
            "reason": "This fertilizer has high NPK content, especially nitrogen. Organic manure and biofertilizers can support nutrient availability naturally."
        },

        "60-40-40": {
            "alternative": "Green Manure, Rock Phosphate, Wood Ash, Compost",
            "reason": "This fertilizer has high nitrogen, phosphorus, and potassium. A mix of organic nitrogen, phosphorus, and potassium sources can be used."
        },

        "60-40-60": {
            "alternative": "Green Manure, Rock Phosphate, Wood Ash, Seaweed Extract",
            "reason": "This fertilizer is rich in nitrogen and potassium. Green manure supports nitrogen, while wood ash and seaweed extract support potassium."
        },

        "80-40-40": {
            "alternative": "Green Manure, Azotobacter, Compost, Rock Phosphate",
            "reason": "This fertilizer has very high nitrogen. Nitrogen-fixing biofertilizers, green manure, and compost can be used to reduce chemical dependency."
        },

        "90-50-50": {
            "alternative": "Green Manure, Compost, Vermicompost, Biofertilizer Mix",
            "reason": "This fertilizer has high NPK content. Organic nutrient sources can improve soil fertility naturally and reduce chemical load."
        },

        "100-50-50": {
            "alternative": "Green Manure, Compost, Vermicompost, Biofertilizer Mix",
            "reason": "This fertilizer has very high nutrient concentration. A mix of organic manures and biofertilizers can support soil fertility in a sustainable way."
        },

        "120-60-60": {
            "alternative": "Green Manure, Azotobacter, Compost, Vermicompost, Rock Phosphate",
            "reason": "This is a very high nutrient fertilizer. Organic nitrogen sources, compost, and phosphorus-supporting biofertilizers can help reduce chemical fertilizer dependency."
        }
    }

    default_response = {
        "alternative": "Compost, Vermicompost, Farmyard Manure, Green Manure",
        "reason": "These biodegradable alternatives improve soil fertility, increase organic matter, and reduce dependency on chemical fertilizers."
    }

    return biodegradable_alternatives.get(fertilizer_name, default_response)



