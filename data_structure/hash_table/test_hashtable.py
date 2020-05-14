import unittest
from hashtable import HashTable


class TestHashTable(unittest.TestCase):
    def setUp(self):
        self.ht = HashTable()

    def test_hash(self):
        self.assertEqual(self.ht.hash("hello"), self.ht.hash("hello"))
        self.assertTrue(self.ht.hash("hello") < self.ht.capacity)

    def test_insert(self):
        self.assertEqual(self.ht.size, 0)

        self.ht.insert("test_key", "test_value")
        self.assertEqual(self.ht.size, 1)

        self.assertEqual(self.ht.buckets[self.ht.hash("test_key")].value, "test_value")

    def test_find(self):
        obj = "hello"
        self.ht.insert("key1", obj)
        self.assertEqual(self.ht.find("key1"), obj)
        obj = ["this", "is", "a", "list"]
        self.ht.insert("key2", obj)
        self.assertEqual(self.ht.find("key2"), obj)

    def test_find_overwritten_value(self):
        self.assertEqual(self.ht.size, 0)

        key = "key1"
        obj = "obj1"
        self.ht.insert(key, obj)
        self.assertEqual(self.ht.find(key), obj)
        self.assertEqual(self.ht.size, 1)

        another_obj = "another_obj"
        self.ht.insert(key, another_obj)
        self.assertEqual(self.ht.find(key), another_obj)
        self.assertEqual(self.ht.size, 1)

    def test_remove(self):
        self.assertEqual(self.ht.size, 0)

        obj = "test object"
        self.ht.insert("key1", obj)
        self.assertEqual(self.ht.size, 1)
        self.assertEqual(self.ht.remove("key1"), obj)
        self.assertEqual(self.ht.size, 0)

        self.assertEqual(self.ht.remove("non exist key"), None)

    def test_capacity(self):
        # Test all public methods in one run at a large capacity
        for i in range(1000):
            self.assertEqual(i, self.ht.size)
            self.ht.insert(f"key{i}", "value")
        self.assertEqual(self.ht.size, 1000)

        for i in range(1000):
            self.assertEqual(1000 - i, self.ht.size)
            self.assertEqual(self.ht.find(f"key{i}"), self.ht.remove(f"key{i}"))

    def test_issue2(self):
        self.assertEqual(self.ht.size, 0)
        self.ht.insert("A", 5)
        self.assertEqual(self.ht.size, 1)
        self.ht.insert("B", 10)
        self.assertEqual(self.ht.size, 2)
        self.ht.insert("Ball", "hello")
        self.assertEqual(self.ht.size, 3)

        self.assertEqual(self.ht.remove("A"), 5)
        self.assertEqual(self.ht.size, 2)
        self.assertEqual(self.ht.remove("A"), None)
        self.assertEqual(self.ht.size, 2)
        self.assertEqual(self.ht.remove("A"), None)
        self.assertEqual(self.ht.size, 2)
