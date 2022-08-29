curl -s -o /dev/null localhost:6000/join -X POST -d @bob.json -H 'content-type:application/json' &
curl localhost:6000/join -X POST -d @alice.json -H 'content-type:application/json' &
wait