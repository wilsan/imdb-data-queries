# imdb-data-queries

The APIs for the three queries are:
'/movies?fields={"title":1,"year":1}&year-gte=2010'
'/movies?fields={"director_name":1,"title":1,"imdb_score":1}&rating-gte=8.0'
'/movies?fields={"title":1,"actor_1":1,"actor_2":1,"actor_3":1}&cast-in=Angelina Jolie Pitt,Brad Pitt'

The "field" parameter is used to select the fields to be displayed and the second parameter is used to query the database.
