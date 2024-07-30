-include .env
HOST ?= "127.0.0.1"
PORT ?= "3000"
.PHONY: deps build dev prod clean disable-telemetry

dev: disable-telemetry
	npx next dev --hostname ${HOST} --port ${PORT} --turbo
dev-https: disable-telemetry
	npx next dev --hostname ${HOST} --port ${PORT} --experimental-https --turbo
build: disable-telemetry
	npx next build
prod: build
	npx next start --hostname ${HOST} --port ${PORT}
deps:
	npm install
clean:
	rm -rf .next
disable-telemetry:
	npx next telemetry disable