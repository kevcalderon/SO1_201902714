import time
from locust import HttpUser, task
import json
import random

class QuickstartUser(HttpUser):
    votos = []
    with open('traffic.json') as json_file:
        data = json.load(json_file)
        votos.extend(data)

    @task
    def insercion_voto(self):
        time.sleep(1)
        response = self.client.post("/voto",json=random.choice(self.votos))
        json_response_dict = response.json()
        print(response.json())