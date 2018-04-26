import scrapy
from scrapy_tut.items import User
# spider to crawl random users for a specific problem
class UsersSpider(scrapy.Spider):
    name = "users"

    start_urls = ['http://codeforces.com/problemset/status/4/problem/A']
    custom_settings = {
        'ITEM_PIPELINES': {
           'pipelines.UsersWriter': 300
        }
    }
    def parse(self, response):
        print "printing response"
        next_page = response.css('div.pagination ul li')[-1].css('a::attr(href)').extract_first()
        for tr in response.css('table.status-frame-datatable')[0].css('tr'):
            for a in tr.css('td a.rated-user'):
                link = a.css('::attr(href)').extract_first().strip()
                name = a.css('::text').extract_first().strip()
                user = {
                    'link': link,
                    'name': name
                }
                yield User(user)

            if next_page is not None:
                next_page = response.urljoin(next_page)
                yield scrapy.Request(next_page, callback=self.parse)
