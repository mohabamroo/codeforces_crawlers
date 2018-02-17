import scrapy
from twisted.internet import reactor, defer
from scrapy.crawler import CrawlerRunner
from scrapy.utils.log import configure_logging
from spiders.codeforces import CodeforcesSpider
from spiders.problems import ProblemSpider

configure_logging()
runner = CrawlerRunner()

@defer.inlineCallbacks
def crawl():
    yield runner.crawl(CodeforcesSpider)
    yield runner.crawl(ProblemSpider)
    reactor.stop()

crawl()
reactor.run() #