# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://doc.scrapy.org/en/latest/topics/items.html

import scrapy

class ScrapyTutItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    pass

class Submission(scrapy.Item):
    problem_id = scrapy.Field()
    verdict = scrapy.Field()
    lang = scrapy.Field()
    problem_link = scrapy.Field()
    title = scrapy.Field()
    time = scrapy.Field()
    memory = scrapy.Field()

class Problem(scrapy.Item):
    id = scrapy.Field()
    link = scrapy.Field()
    title = scrapy.Field()
    solved_times = scrapy.Field()
    status_link = scrapy.Field()
