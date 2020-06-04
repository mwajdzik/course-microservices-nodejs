
## Run

- start tickets project
- kubectl get pods
- kubectl port-forward nats-depl-6dddd88749-g2dmk 4222:4222
- kubectl port-forward nats-depl-6dddd88749-g2dmk 8222:8222

- npm run publish
- npm run listen


## NATS Streaming

- channel
- queue group - created inside when subscribing to a channel - only one listener will get the event (not all of them)
- options
    - setManualAckMode - listener must manually acknowledge 

## Monitoring

- http://localhost:8222/streaming
- http://localhost:8222/streaming/channelsz?subs=1

