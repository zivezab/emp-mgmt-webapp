FROM python:3
ENV PYTHONUNBUFFERED=1
RUN mkdir /code
WORKDIR /code
COPY requirements.txt /code/
RUN pip install -r requirements.txt
RUN apt-get update && apt-get install -y gettext
COPY entrypoint.sh /code/
COPY . /code/
RUN chmod a+x /code/entrypoint.sh
ENTRYPOINT ["/code/entrypoint.sh"]