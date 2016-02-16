# barchat

# deployment
docker-compose build  barchat-web
docker tag -f barchat_barchat-web   metalaureate/barchat_web
docker push metalaureate/barchat_web

currently @ http://barchat-web.barchat-prototype.91625b36.svc.dockerapp.io/
