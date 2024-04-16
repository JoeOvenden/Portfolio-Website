import csv, os
from django.shortcuts import render

# Create your views here.

class Project_Card:
    def __init__(self, values):
        self.title, self.id, self.image_link, self.url, self.description = values
        self.id = int(self.id)
        self.description = self.description.split("\n")
        print(self.description)


def get_project_cards():
    cards = []
    with open('about/templates/about/project-cards-info.csv', newline='') as csvfile:
        csvreader = csv.reader(csvfile)
        next(csvreader)     # Skip the header row

        for row in csvreader:
            card = Project_Card(row)
            cards.append(card)

    return cards


def index(request):
    project_cards = get_project_cards()

    return render(request, "about/index.html", {
        "project_cards": project_cards
    })