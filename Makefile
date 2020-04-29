start:
	yarn run start

lint:
	yarn run lint

test:
	yarn run test

remove_cache:
	rm -rf node_modules/.cache

clean:
	rm -rf node_modules

build-prod:
	GENERATE_SOURCEMAP=false yarn run build

fix:
	yarn run lint --fix
	yarn run pretty-quick --branch master
