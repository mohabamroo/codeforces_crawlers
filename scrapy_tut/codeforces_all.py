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
    # yield runner.crawl(CodeforcesSpider)
    # yield runner.crawl(ProblemSpider)
    # yield runner.crawl(UsersSpider)
    count_file = open('JSON/count.txt', 'w')
    count_file.write(str(0))
    count_file.close()
    users_file = open('JSON/users.json', 'r')
    for user_line in list(users_file):
        try:
            username = json.loads(user_line)['name']
            print "Started crawling user: ", username
            yield runner.crawl(UserSubmissiosSpider, username=username)
        except Exception:
            print "Not a valid user."
    reactor.stop()


crawl()
reactor.run()
