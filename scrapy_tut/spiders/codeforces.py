import scrapy
from scrapy_tut.items import Submission
# test spider to crawl me only
class CodeforcesSpider(scrapy.Spider):
    name = "codeforces"

    custom_settings = {
        'ITEM_PIPELINES': {
           'scrapy_tut.pipelines.MongoSubmissionsPipeline': 300
        }
    }

    def __init__(self, username=None, *args, **kwargs):
        super(CodeforcesSpider, self).__init__(*args, **kwargs)
        if(username is not None):
            self.username = username
        else:
            self.username = "mohabamr"
        self.start_urls = [
            'http://codeforces.com/submissions/'+self.username+'/page/1']


    def parse(self, response):
        next_page = response.css('div.pagination ul li')[-1].css('a::attr(href)').extract_first()
        rows = response.css('table.status-frame-datatable tr')
        rows_c = 0
        for tr in rows:
            if(rows_c!=0):
                problem_id = tr.css('::attr(data-submission-id)').extract_first().strip()
                verdict = tr.css('td.status-verdict-cell span::attr(submissionverdict)').extract_first().strip()
                lang = tr.css('td')[4].css('::text').extract_first().strip()
                problem_link = tr.css('a::attr(href)').re_first('/contest/.*/problem/.*')
                if(problem_link != None):
                    problem_link = problem_link.strip()
                title = tr.css('a::text')[-1].extract().strip()
                time = tr.css('td.time-consumed-cell::text').extract_first().strip()
                memory = tr.css('td.memory-consumed-cell::text').extract_first().strip()
                # print problem_id, verdict, lang, problem_link, title, time, memory
                problem_obj = {
                    'problem_id': problem_id,
                    'verdict': verdict,
                    'lang': lang,
                    'problem_link': problem_link,
                    'title': title,
                    'time': time,
                    'memory': memory
                }
                yield Submission(problem_obj)
            rows_c += 1

        if next_page is not None:
            next_page = response.urljoin(next_page)
            yield scrapy.Request(next_page, callback=self.parse)
