
## Minikube

- proxyoff
- minikube start --vm-driver virtualbox
- minikube delete

## kubectl

- kubectl apply -f posts.yaml
- kubectl apply -f posts-depl.yaml

- kubectl get pods
- kubectl get services 
- kubectl get deployments

- kubectl delete pod posts
- kubectl delete deployment posts-depl

## commands

- kubectl exec -it pod_name cmd
- kubectl logs pod_name
- kubectl describe pod pod_name
- kubectl rollout restart deployment depl_name

## set up everything

- for each microservice
    - docker build -t dornick/posts:latest .
    - docker push dornick/posts:latest
    
- kubectl apply -f posts.yaml
- kubectl rollout restart deployment posts-depl

- check port with: kubectl get services (NodePort)
- minikube ip

- POST {"title": "nowy post"} to 192.168.64.3:31824/posts
