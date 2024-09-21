from flask import Flask, request, jsonify
from sklearn.cluster import KMeans
from flask_cors import CORS
import numpy as np
import cv2
import matplotlib.pyplot as plt
import io
import base64

app = Flask(__name__)
CORS(app) 

@app.route('/upload', methods=['POST'])
def upload_image():
    file = request.files['image']
    
    # Read image file from the request
    img_array = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    
    # KMeans Clustering
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = img.reshape((img.shape[0] * img.shape[1], img.shape[2]))
    k = 5
    kmeans = KMeans(n_clusters=k)
    kmeans.fit(img)
    
    centroid = kmeans.cluster_centers_
    labels = kmeans.labels_
    labels = list(labels)
    
    # Calculate the percentage of each color
    percent = []
    for i in range(len(centroid)):
        j = labels.count(i)
        j = j / len(kmeans.labels_)
        percent.append(j)

    # Generate a pie chart for the color distribution
    plt.figure()
    plt.pie(percent, colors=np.array(centroid/255), labels=np.arange(len(centroid)), autopct='%1.2f%%')
    
    # Save the plot to a byte buffer
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    plot_data = base64.b64encode(buf.read()).decode('utf-8')
    
    # Clear plot and buffer
    plt.clf()
    buf.close()
    
    return jsonify({'plot': plot_data})

if __name__ == '__main__':
    app.run(debug=True)
