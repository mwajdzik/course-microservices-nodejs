## Microservices

- the big challenge in microservices is data
	- each microservice must have its own database to be isolated and independent
	- we should prefer async communication (event bus) over blocking sync communication (still a valid option if needed)
	- the storage is cheap, so we should not be afraid of data duplication
- async communication uses events that are sent to the event bus and other microservices can react 

## Blog app

- posts, comments services get data from the client
- they send updates to the event bus, which distributes them among all services
- the query service builds its own knowledge about posts and comments
- the moderation service picks up newly added comments, checks them and sends updates to the comments service

## Authentication

- solution 1) 
    - the client authenticates in the auth service
    - each time it sends a request it is checked against this service if the user is authenticated
    - cons: if the auth service is not active, nothing works
- solution 2)
    - independent solution
    - each service is able to detect if the sent token is valid or not
    - cons: what if the user is removed and can still access the system
    - possible solution - when the user is deactivated, broadcast event to all services that keep a short-live cache to check if the uses is not on the black list
    

## Cookies vs. JWT (Json Web Token)

- Cookies
    - transport mechanism
    - moves any kind of data between a browser and server (can be JWT)
    - automatically managed by the browser
- JWT
    - authentication/authorization mechanism
    - stores any data we want (JSON)
    - have to be managed manually

## Skaffold

- can be run locally: skaffold dev
- can work with GCP:
    - if we change any synced file (skaffold.yml) - corresponding files will be updated in pods of the GCP cluster
    - if we change any unsynced file - Skaffold will trigger docker build using Google Cloud Build, create a new image and update a deployment

## Google Cloud

- create a cluster 
    - name: ticketing-dev
    - zone: europe
    - master version >= 1.15
    - size: 3
    - type: g1-small
