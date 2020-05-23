
## Minikube

- proxyoff
- minikube start --vm-driver virtualbox
- minikube stop
- minikube delete

## kubectl

- kubectl apply -f posts.yaml
- kubectl apply -f posts-depl.yaml

- kubectl get pods
- kubectl get services 
- kubectl get deployments
- kubectl get ingress

- kubectl delete pod posts
- kubectl delete deployment posts-depl

## commands

- kubectl exec -it pod_name cmd
- kubectl logs pod_name
- kubectl describe pod pod_name
- kubectl rollout restart deployment depl_name

## set up everything

- for each microservice
    - docker build -t dornick/comments:latest .
    - docker push dornick/comments:latest
    
- https://kubernetes.github.io/ingress-nginx/deploy/#docker-for-mac    
- minikube addons enable ingress
- kubectl delete validatingwebhookconfiguration ingress-nginx-admission         (if error and redeploying)

- kubectl apply -f .
- kubectl rollout restart deployment posts-depl

## check
- kubectl describe pod client-depl
- kubectl describe ingress ingress-srv

## posts.com
- modify /etc/hosts
- get IP with: minikube ip
- add: 192.168.64.4 posts.com 

# test
- POST {"title": "new post"} to 192.168.64.3:31255/posts        kubectl get services (NodePort)
- POST {"title": "new post"} to posts.com/posts
- open http://posts.com/posts

