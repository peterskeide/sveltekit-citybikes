wiremock:
	docker run -it --rm \
	-p 9000:8080 \
	--name wiremock \
	-v ${PWD}/tests/wiremock:/home/wiremock \
	wiremock/wiremock:3.1.0-1

docker-build:
	docker build -t bysykkel-app .

docker-run:
	docker run -it --rm -p 3000:3000 --name bysykkel-app bysykkel-app
