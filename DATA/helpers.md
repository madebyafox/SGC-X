mongoexport --collection=india-juliet-kilo-lima --db=FALL2017 --jsonArray --out=x_india-juliet-kilo-lima.json

mongoexport --collection=november-EXTRA --db=FALL2017 --jsonArray --out=x_november-EXTRA.json

XX 7WCYU DELTA 8
XX B50YA MIKE 16
XX J1880 INDIA 16
XX XYUT7 INDIA 28
XX B45BJ JULIET 32
X H3LT8 ALFA novemberextra 10



20 excluded + 6 = 26 ecluded

current
10 excluded
2940 blocks
196 participants



mongoexport --collection=x_final_participants --db=FALL2017 --jsonArray --out=2017-final_participants.json


mongoexport --collection=delta --db=XFALL2017 --jsonArray --out=x_delta.json
mongoimport -d XFALL2017 -c delta --file delta.json


mongoimport -d shib -c alfa-bravo-charlie --file alfa-bravo-charlie.json
mongoimport -d shib -c delta --file delta.json
mongoimport -d shib -c echo --file echo.json
mongoimport -d shib -c foxtrot --file foxtrot.json
mongoimport -d shib -c golf --file golf.json
mongoimport -d shib -c hotel --file hotel.json
mongoimport -d shib -c india-juliet-kilo-lima --file india-juliet-kilo-lima.json
mongoimport -d shib -c mike --file mike.json
mongoimport -d shib -c november-EXTRA --file november-EXTRA.json
