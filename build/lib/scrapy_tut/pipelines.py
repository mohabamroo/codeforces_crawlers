# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://doc.scrapy.org/en/latest/topics/item-pipeline.html

import json
from pymongo import MongoClient


class ScrapyTutPipeline(object):
    def process_item(self, item, spider):
        print "outer spider"
        return item

class MongoSubmissionsPipeline(object):
    # saves submissions per user in Mongo DB

    def open_spider(self, spider):
        # initialize Database connection
        print "Opened spider: " + spider.name
        uri = 'mongodb://mohabamroo:ghostrider1@ds241699.mlab.com:41699/bachelor';
        client = MongoClient(uri,
            connectTimeoutMS=30000,
            socketTimeoutMS=None,
            socketKeepAlive=True)
        self.db = client.get_database()
        self.problems = []
        print "Connected to Mongo DB"

    def close_spider(self, spider):
        # saves the user crawled
        submissions_collection = self.db['all_submissions']
        pre_user = submissions_collection.find_one({'user': spider.username})
        entry = {'user': spider.username, 'problems': self.problems}
        if pre_user == None:
            submissions_collection.insert(entry, check_keys=False)
        else:
            submissions_collection.update({'user': spider.username}, entry, check_keys=False)
        print "Saved user in Mongo DB"
        # self.db.close()

    def process_item(self, item, spider):
        try:
            link_splitted = item['problem_link'].split('/')
            problem_id = link_splitted[2] + '' + link_splitted[4]
            self.problems.append(item)
        except:
            # ignore problem because of ill formated ID or it's a GYM problem
            zazo = ''
        return item

class JsonWriterPipeline(object):

    def open_spider(self, spider):
        print "Opened spider: " + spider.name
        try:
            file_path = 'JSON/users_submissions/'+spider.username+'.json'
        except Exception as e:
            file_path = 'JSON/mohab.json'
        self.file = open(file_path, 'w')
        self.count_file = open('JSON/count.txt', 'r')
        self.count = int(list(self.count_file)[0])
        self.count_file.close()
        print "Current count: ", self.count

    def close_spider(self, spider):
        self.count_file = open('JSON/count.txt', 'w')
        self.count_file.write(str(self.count))
        self.count_file.close()
        self.file.close()

    def process_item(self, item, spider):
        line=json.dumps(dict(item)) + "\n"
        self.file.write(line)
        self.count= int(self.count) + 1
        return item


class ProblemsPipeline(object):

    def open_spider(self, spider):
        print "Opened spider: " + spider.name
        self.file=open('JSON/problems.json', 'w')

    def close_spider(self, spider):
        self.file.close()

    def process_item(self, item, spider):
        line=json.dumps(dict(item)) + "\n"
        self.file.write(line)
        return item


class UsersWriter(object):

    def open_spider(self, spider):
        print "Opened spider: " + spider.name
        self.file=open('JSON/users.json', 'w')

    def close_spider(self, spider):
        self.file.close()

    def process_item(self, item, spider):
        line=json.dumps(dict(item)) + "\n"
        self.file.write(line)
        return item
