from django.shortcuts import render, redirect
from user.models import *
from django.db.models import Q
from django.contrib.auth import logout, login
from django.contrib.auth.hashers import check_password
from .form import MyUserCreationForm
from index.models import *

from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from django.contrib.auth.decorators import login_required

# Create your views here.


def loginview(request):
    user = MyUserCreationForm()
    if request.method == 'POST':
        # 登录处理
        if request.POST.get('loginUser', ''):
            loginUser = request.POST.get('loginUser', '')
            password = request.POST.get('password', '')
            try:
                user = MyUser.objects.get(Q(mobile=loginUser) | Q(username=loginUser))
                if check_password(password, user.password):
                    login(request, user)
                    return redirect('/user/home/1.html')
                else:
                    tips = '密码错误'
            except MyUser.DoesNotExist:
                tips = '用户不存在'
        # 注册处理
        else:
            form = MyUserCreationForm(request.POST)
            if form.is_valid():
                user = form.save()
                login(request, user)  # 注册成功后自动登录
                return redirect('/user/home/1.html')
            else:
                if form.errors.get('username'):
                    tips = form.errors['username'][0]
                elif form.errors.get('mobile'):
                    tips = form.errors['mobile'][0]
                else:
                    tips = '注册失败，请检查输入信息'
                user = form  # 保持表单数据
    return render(request, 'login.html', locals())


def logoutview(request):
    logout(request)
    return redirect('/')


# 用户中心
@login_required(login_url='/user/login.html')
def homeview(request, page):
    # 热搜歌曲
    search_song = Dynamic.objects.select_related('song').order_by('-dynamic_search').all()[:6]
    # 分页功能
    song_info = request.session.get('play_list', [])
    print(song_info)
    paginator = Paginator(song_info, 3)
    try:
        contacts = paginator.page(page)
    except PageNotAnInteger:
        contacts = paginator.page(1)
    except EmptyPage:
        contacts = paginator.page(paginator.num_pages)
    return render(request, 'home.html', locals())
