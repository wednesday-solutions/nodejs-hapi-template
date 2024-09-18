docker:
	docker-compose --env-file ./.env.docker \
	-f docker-compose.yml \
	-f docker-compose.yml down

	docker-compose --env-file ./.env.docker \
	-f docker-compose.yml \
	-f docker-compose.yml build

	docker-compose --env-file ./.env.docker \
	-f docker-compose.yml \
	-f docker-compose.yml up

keploy-coverage-report:
	docker cp app:$(CURDIR)/coverage_keploy/ ./
	cd coverage_keploy
	npx nyc report --report-dir coverage_keploy/report

combine-coverage:
	mkdir -p coverage_combined
	cp -r coverage_keploy/.nyc_output coverage_combined/
	cp coverage/coverage-final.json coverage_combined/.nyc_output/
	npx nyc merge coverage_combined/.nyc_output coverage_combined/coverage.json
	npx nyc report -t coverage_combined --report-dir coverage_combined/report
