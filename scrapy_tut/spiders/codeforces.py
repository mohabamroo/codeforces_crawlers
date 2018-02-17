import scrapy
from items import Submission

class CodeforcesSpider(scrapy.Spider):
    name = "codeforces"

    start_urls = ['http://codeforces.com/submissions/mohabamr/page/1']
    custom_settings = {
        'ITEM_PIPELINES': {
           'pipelines.JsonWriterPipeline': 300
        }
    }
    def parse(self, response):
        print "printing response"
        next_page = response.css('div.pagination ul li')[-1].css('a::attr(href)').extract_first()
        rows = response.css('table.status-frame-datatable tr')
        rows_c = 0
        for tr in rows:
            if(rows_c!=0):
                problem_id = tr.css('::attr(data-submission-id)').extract_first().strip()
                verdict = tr.css('td.status-verdict-cell span::attr(submissionverdict)').extract_first().strip()
                lang = tr.css('td')[4].css('::text').extract_first().strip()
                problem_link = tr.css('a::attr(href)').re_first('/problemset/.*').strip()
                title = tr.css('a')[1].css('::text').extract_first().strip()
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
