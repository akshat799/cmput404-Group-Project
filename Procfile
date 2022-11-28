web: gunicorn ./backend/socialnetwork/socialnetwork.wsgi:application --log-file -
release: cd ./backend/socialnetwork:python manage.py migrate
