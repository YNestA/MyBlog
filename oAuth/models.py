from django.db import models
from datetime import datetime

class WeiboLoginRecord(models.Model):
    uid=models.CharField(max_length=50)
    name=models.CharField(max_length=200)
    profile_url=models.CharField(max_length=500)
    time=models.DateTimeField(default=datetime.now)
    head_img=models.CharField(max_length=500)

    @staticmethod
    def save_record(uid,name,profile_url,head_img):
        record=WeiboLoginRecord(uid=uid,name=name,profile_url=profile_url,head_img=head_img)
        record.save()

    def __unicode__(self):
        return ' | '.join([self.uid,self.name,self.time.strftime("%c")])
