from django.shortcuts import render
from index.models import *



# Create your views here.


def recommendview(request):
    # 热搜歌曲
    search_song = Dynamic.objects.select_related('song').order_by('-dynamic_search').all()[:4]
    print(f'search_song是{search_song}')

    # 音乐分类
    All_list = Song.objects.values('song_type').distinct()
    print(f'All_list是{All_list}')

    # 歌曲列表信息
    song_type = request.GET.get('type', '')
    print(f'song_type是{song_type}')

    if song_type:
        song_info = Dynamic.objects.select_related('song').filter(song__song_type=song_type).order_by('?')[:10]  # 随机排序
    else:
        song_info = Dynamic.objects.select_related('song').order_by('?')[:10]  # 随机排序
        print([f'song_info是{song_info}'])

    return render(request, 'recommend.html', locals())
#




# from django.shortcuts import render, redirect
# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# import random
#
# # 定义不同情感对应的页面
# emotion_pages = {
#     'happy': '/happy-music/',
#     'sad': '/sad-music/',
#     'angry': '/angry-music/',
#     'surprised': '/surprised-music/',
#     'neutral': '/neutral-music/'
# }
#
# # 首页，显示人脸识别页面
# def recommend(request):
#     return render(request, 'recommend.html')
#
# # 接收前端情感数据，并根据情感进行跳转
# @csrf_exempt
# def detect_emotion(request):
#     if request.method == 'POST':
#         import json
#         data = json.loads(request.body)
#         emotion = data.get('emotion')
#
#         # 根据情感决定跳转页面
#         if emotion in emotion_pages:
#             return JsonResponse({'redirect_url': emotion_pages[emotion]})
#         else:
#             # 如果没有匹配到，随机跳转到一个页面
#             random_emotion = random.choice(list(emotion_pages.values()))
#             return JsonResponse({'redirect_url': random_emotion})
#
#     return JsonResponse({'error': 'Invalid request'}, status=400)
#
# # 情感对应的音乐页面
# def happy_music(request):
#     return render(request, 'happy_music.html')
#
# def sad_music(request):
#     return render(request, 'sad_music.html')
#
# def angry_music(request):
#     return render(request, 'angry_music.html')
#
# def surprised_music(request):
#     return render(request, 'surprised_music.html')
#
# def neutral_music(request):
#     return render(request, 'neutral_music.html')
