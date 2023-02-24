#!/bin/bash

autocannon http://localhost/questions/all -d 10 -c 30  -m GET

wrk -t12 -c1024 --timeout 30s http://localhost/questions/all