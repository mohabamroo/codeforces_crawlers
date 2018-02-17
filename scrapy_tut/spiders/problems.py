import scrapy
from items import Problem

class ProblemSpider(scrapy.Spider):
    name = "problems"

    start_urls = ['http://codeforces.com/problemset/page/1?order=BY_SOLVED_DESC']
    custom_settings = {
        'ITEM_PIPELINES': {
           'pipelines.ProblemsPipeline': 300
        }
    }

    def parse(self, response):
        print "ok"
        next_page = response.css('div.pagination ul li')[-1].css('a::attr(href)').extract_first()
        first = 1
        for tr in response.css('table.problems')[0].css('tr'):
            if(first==1):
                first = 0
                continue
            id = tr.css('td.id a::text').extract_first().strip()
            link = tr.css('td.id a::attr(href)').extract_first().strip()
            title = tr.css('td div')[0].css('a::text').extract_first().strip()
            solved_times = tr.css('td')[-1].css('a')
            if(len(solved_times)>0):
                solved_times = solved_times[0].css('::text').extract_first().strip()[1::]
                status_link = tr.css('td')[-1].css('a')[0].css('::attr(href)').extract_first().strip()
            for a in tr.css('td div')[1].css('a'):
                tag = a.css('::text').extract_first()
                link = a.css('::attr(href)').extract_first()
            problem = {
                'id': id,
                'link': link,
                'title': title,
                'solved_times': solved_times,
                'status_link': status_link
            }
            print problem
            yield Problem(problem)
            if next_page is not None:
                next_page = response.urljoin(next_page)
                yield scrapy.Request(next_page, callback=self.parse)
