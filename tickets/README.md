## Skaffold

- proxyoff
- minikube start

- skaffold dev

- https://kubernetes.github.io/ingress-nginx/deploy/#docker-for-mac    
- minikube addons enable ingress
- kubectl delete validatingwebhookconfiguration ingress-nginx-admission         (if error and redeploying)

- minikube ip
- subl /etc/hosts

- Chrome - type: thisisunsafe

- kubectl create secret generic jwt-secret --from-literal=JWT_KEY=some-crazy-secret-value
