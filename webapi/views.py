from ast import keyword
from sqlite3 import Cursor
from tkinter.messagebox import NO
from unittest import result
from django.db import connection
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view()
def get_test_page(request):
    return Response({
        "testData": 'done!'
    })

def exec_sql(sql):
    cursor = connection.cursor()
    print("連線資料庫成功")
    try:
        result = cursor.execute(sql)
        result = cursor.fetchall()
        return result
    except BaseException as e:
        print("===> ERROR: exec_sql: ",e)
        return None, e
    finally:
        cursor.close()
@api_view(['POST'])
def get_scholar(request):
    # keywords = request.GET.getlist('keywords[]')
    # print("keywords:",keywords)
    # if not keywords:
    #     data = {
    #         "error":"Without keywords!"
    #     }
    #     return JsonResponse(data)
    
    # if len(keywords) == 1:
    #     task_tuple_str = str(tuple(keywords[:]))
    #     format_keyword_list = task_tuple_str.replace(",","")
    # else:
    #     format_keyword_list = str(tuple(keywords[:]))
    keywords = request.data['keywords']
    print(keywords)
    '.'.join(['a', 'b', 'c']) # 'a.b.c'

    sql = (
        "SELECT PI,COUNT(PI),s_id ",
        "FROM all_project_info ",
        "WHERE",
        ''.join(f"(KEYWORD_C LIKE '%{keyword}%' OR Pabstract_ch LIKE '%{keyword}%' OR PNCH_DESC LIKE '%{keyword}%') AND "  for keyword in keywords),
        "( PLAN_ORGAN_CODE='科技部' OR PLAN_ORGAN_CODE='行政院國家科學委員會') ",
        "AND PI IN (SELECT name FROM scholar_info) ",
        "AND INSTR(plan_no, 'E') > 0 ",
        "AND s_id !='' ",
        "GROUP BY PI,s_id ",
        "ORDER BY COUNT(PI) DESC ",
        "LIMIT 1000;",
    )
    print(sql)
    sql = ''.join(sql)
    sql.format(keyword)
    result =exec_sql(sql)
    data = {
        "scholars":[]
    }

    for item in result:
        scholar = {
            "scholar_name": item[0],
            "scholar_project_count": item[1],
            "scholar_s_id": item[2],
        }
        data.get("scholars").append(scholar)

    return Response(data)

@api_view()
def get_project_detail(request):
    sql = (
        "SELECT PI,s_id,PNCH_DESC,EXCU_ORGAN_NAME,PLAN_YEAR,PLAN_AMT,RESEARCHER "
        "FROM all_project_info "
        "WHERE s_id = '1772' "
        "AND (KEYWORD_C LIKE '%人工智慧%' OR Pabstract_ch LIKE '%人工智慧%') "
        "AND ( PLAN_ORGAN_CODE='科技部' OR PLAN_ORGAN_CODE='行政院國家科學委員會') "
        "AND INSTR(plan_no, 'E') > 0 "
        "LIMIT 100;"
    )
    result =exec_sql(sql)
    data = {
        "projects":[]
    }

    for item in result:
        project = {
            "scholar_name": item[0],
            "scholar_s_id": item[1],
            "project_name": item[2],
            "project_EXCU": item[3],
            "project_YEAR": item[4],
            "project_AMT": item[5],
            "project_RESEARCHER": item[6],
        }
        data.get("projects").append(project)

    return Response(data)
