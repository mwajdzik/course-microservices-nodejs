## Skaffold

- proxyoff
- minikube start
- minikube ip

- kubectl create secret generic jwt-secret --from-literal=JWT_KEY=some-crazy-secret-value
- kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-0.31.0/deploy/static/provider/cloud/deploy.yaml

- minikube addons enable ingress
- kubectl get pods -n kube-system

- skaffold dev
- skaffold delete

- kubectl get svc
- kubectl get pods
- kubectl get ingress
- kubectl get namespace

- kubectl describe ingress

- kubectl get services --namespace default
- kubectl get services --namespace ingress-nginx

- check: /etc/hosts
- open http://ticketing.dev
- Chrome - type: thisisunsafe
