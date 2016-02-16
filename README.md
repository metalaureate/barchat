# barchat

# deployment
docker-compose build  barchat-web
docker tag -f barchat_barchat-web   metalaureate/barchat_web
docker push metalaureate/barchat_web

