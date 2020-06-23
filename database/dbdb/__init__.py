# dbdb/__init__.py
import os

from dbdb.interface import DBDB


def connect(dbname):
    try:
        f = open(dbname, "r+b")
    except IOError:
        fd = os.open(dbname, os.O_RDWR | os.O_CREAT)
        f = os.fdopen(fd, "r+b")

    return DBDB(f)
