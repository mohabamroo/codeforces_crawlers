import scrapy
from twisted.internet import reactor, defer
from scrapy.crawler import CrawlerRunner
from scrapy.utils.log import configure_logging
from spiders.codeforces import CodeforcesSpider
from spiders.problems import ProblemSpider
from spiders.user import UsersSpider
from spiders.user_submissions import UserSubmissiosSpider
import json
import items

configure_logging()
runner = CrawlerRunner()
CODEFORCES_ROOT = 'http://codeforces.com'


@defer.inlineCallbacks
def crawl():
    username = "Med0b1011"
    try:
        print "Started crawling user: ", username
        yield runner.crawl(UserSubmissiosSpider, username=username)
        reactor.stop()
    except Exception:
        print "Not a valid user."

crawl()
reactor.run()
