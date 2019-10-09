# api-exposer
Node.js api exposer, multi-protocol server

Version 0.0.0 - proof of concept.

Roadmap:
0.0.1 - make npm package
0.0.2 - make /example
0.0.3 - create http tests
0.0.4 - divide protocols into sub-packages


## Usage:
docker run -d --hostname my-rabbit --name my-rabbit -p 15672:15672 -p 5672:5672 -p 5671:5671 rabbitmq:3-management

npm start

test end-poins like:
http://localhost:3000
http://localhost:3000/users
...

