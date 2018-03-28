import scrapy
from items import Submission


class UserSubmissiosSpider(scrapy.Spider):
    name = "user_submissions"
    custom_settings = {
        'ITEM_PIPELINES': {
            'pipelines.JsonWriterPipeline': 300
        },
        'LOG_LEVEL': 'ERROR'
    }

    def __init__(self, username=None, *args, **kwargs):
        super(UserSubmissiosSpider, self).__init__(*args, **kwargs)
        if(username is not None):
            self.username = username
        else:
            self.username = "mohabamr"
        self.start_urls = [
            'http://codeforces.com/submissions/'+self.username+'/page/1']

    def parse(self, response):
        try:
            next_page = response.css(
                'div.pagination ul li')[-1].css('a::attr(href)').extract_first()
        except Exception as e:
            next_page = None
        rows = response.css('table.status-frame-datatable tr')
        rows_c = 0
        for tr in rows:
            if(rows_c != 0):
                problem_id = tr.css(
                    '::attr(data-submission-id)').extract_first().strip()
                verdict = tr.css(
                    'td.status-verdict-cell span::attr(submissionverdict)').extract_first().strip()
                lang = tr.css('td')[4].css('::text').extract_first().strip()
                problem_link = tr.css('a::attr(href)').re_first(
                    '/problemset/.*').strip()
                title = tr.css(
                    'td.status-small a::text').extract_first().strip()
                time = tr.css(
                    'td.time-consumed-cell::text').extract_first().strip()
                time = time.encode('ascii', 'ignore')
                memory = tr.css(
                    'td.memory-consumed-cell::text').extract_first().strip()
                memory = memory.encode('ascii', 'ignore')
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
