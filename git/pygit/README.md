### Link
- [pygit: Just enough of a Git client to create a repo, commit, and push itself to GitHub](https://benhoyt.com/writings/pygit/)




### Using PYGIT
```python
$ python3 misc/pygit.py init pygit
initialized empty repository: pygit

$ cd pygit

# ... write and test pygit.py using a test repo ...

$ python3 pygit.py status
new files:
    pygit.py

$ python3 pygit.py add pygit.py

$ python3 pygit.py commit -m "First working version of pygit"
committed to master: 00d56c2a774147c35eeb7b205c0595cf436bf2fe

$ python3 pygit.py cat-file commit 00d5
tree 7758205fe7dfc6638bd5b098f6b653b2edd0657b
author Ben Hoyt <benhoyt@gmail.com> 1493169321 -0500
committer Ben Hoyt <benhoyt@gmail.com> 1493169321 -0500

First working version of pygit

# ... make some changes ...

$ python3 pygit.py status
changed files:
    pygit.py

$ python3 pygit.py diff

$ python3 pygit.py add pygit.py

$ python3 pygit.py commit -m "Graceful error exit for cat-file with bad
    object type"
committed to master: 4117234220d4e9927e1a626b85e33041989252b5

$ python3 pygit.py push https://github.com/benhoyt/pygit.git
updating remote master from no commits to
    4117234220d4e9927e1a626b85e33041989252b5 (6 objects)
```