# cmput404-Group-Project

CMPUT404 Fall 2022 Team 18 Group Project


### Note about Postgres

```shell
brew install postgresql
```

### Virtual Environment (`virtualenv`)

Create your Python3 virtual environment:
```console
virtualenv ./venv
```

Activate it:
```console
. venv/bin/activate
```

### For devs:

For backend devs:

```console
cd backend
pip install -r requirements.txt
```

For frontend devs:

```console
cd frontend
npm install
```

## Running Django

Change into the project directory:
```console
cd backend/socialnetwork
```

Run any pending migrations:

```console
python3 manage.py migrate
```

Start the development server:

```console
python3 manage.py runserver
```

## Running Tests
```console
cd backend/socialnetwork
```

```console
python3 manage.py test --settings socialnetwork.test_setting.local
```

## Resources / Dependencies Used
