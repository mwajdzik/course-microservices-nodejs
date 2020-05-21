
ROOT=$(pwd)

cd "${ROOT}/comments" || exit
docker build -t dornick/comments:latest .

cd "${ROOT}/event-bus" || exit
docker build -t dornick/event-bus:latest .

cd "${ROOT}/moderation" || exit
docker build -t dornick/moderation:latest .

cd "${ROOT}/posts" || exit
docker build -t dornick/posts:latest .

cd "${ROOT}/query" || exit
docker build -t dornick/query:latest .

cd "${ROOT}" || exit

docker push dornick/comments:latest
docker push dornick/event-bus:latest
docker push dornick/moderation:latest
docker push dornick/posts:latest
docker push dornick/query:latest
