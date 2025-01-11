import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from groclake.vectorlake import VectorLake
from groclake.datalake import DataLake
from groclake.modellake import ModelLake

# Flask App
app = Flask(__name__)

# Enable CORS with a simpler configuration first
CORS(app, 
     origins=["http://localhost:5173"],
     allow_credentials=True,
     methods=["GET", "POST", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"]
)

# Add CORS headers to all responses
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

# Your existing code remains the same
GROCLAKE_API_KEY = 'f4b9ec30ad9f68f89b29639786cb62ef'
GROCLAKE_ACCOUNT_ID = '9aa298b6c85bdb2860aeda83961022bb'

os.environ['GROCLAKE_API_KEY'] = GROCLAKE_API_KEY
os.environ['GROCLAKE_ACCOUNT_ID'] = GROCLAKE_ACCOUNT_ID

vectorlake = VectorLake()
datalake = DataLake()
modellake = ModelLake()

datalake_id = None
vectorlake_id = None

@app.route('/chat', methods=['POST', 'OPTIONS'])
def chat():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        return jsonify({"message": "OK"}), 200

    try:
        query = request.json.get("query")
        if not query:
            return jsonify({"error": "Query is required."}), 400

        # Your existing chat logic here
        vector_search_data = vectorlake.generate(query)
        search_vector = vector_search_data.get("vector")

        search_payload = {
            "vector": search_vector,
            "vectorlake_id": vectorlake_id,
            "vector_type": "text",
        }
        search_response = vectorlake.search(search_payload)
        search_results = search_response.get("results", [])

        enriched_context = " ".join([result.get("vector_document", "") for result in search_results])

        payload = {
            "messages": [
                {"role": "system", "content": "You are an HR assistant providing accurate office-related guidance."},
                {
                    "role": "user",
                    "content": f"Using the following context: {enriched_context}, answer the question: {query}."
                }
            ]
        }
        chat_response = modellake.chat_complete(payload)
        answer = chat_response.get("answer", "No answer received.")
        return jsonify({"answer": answer}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # For development only
    app.run(host='0.0.0.0', port=5000, debug=True)