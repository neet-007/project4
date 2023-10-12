from django import forms

class new_post_form(forms.Form):
    post = forms.CharField(max_length=240, label="New post", widget=forms.Textarea(attrs={'id':'new-post-input'}))

class reply_post_form(forms.Form):
    reply = forms.CharField(max_length=240, label="reply", widget=forms.Textarea(attrs={'id':'reply-input'}))