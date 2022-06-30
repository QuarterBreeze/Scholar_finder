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
        print("===> ERROR: exec_sql: ", e)
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
    institutions = request.data['school']
    if institutions == ['']:
        institutions = []
    if institutions == [None]:
        institutions = []
    departments = request.data['department']
    if departments == ['']:
        departments = []
    if departments == [None]:
        departments = []
    print(keywords)
    '.'.join(['a', 'b', 'c'])  # 'a.b.c'
    print('institution:', institutions)
    print('department:', departments)

    sql = (
        "SELECT PI,COUNT(PI),s_id ",
        "FROM all_project_info ",
        "WHERE",
        ''.join(
            f"(KEYWORD_C LIKE '%{keyword}%' OR Pabstract_ch LIKE '%{keyword}%' OR PNCH_DESC LIKE '%{keyword}%') AND " for keyword in keywords),
        "( PLAN_ORGAN_CODE='科技部' OR PLAN_ORGAN_CODE='行政院國家科學委員會') ",
        "AND PI IN (SELECT name FROM scholar_info ",
        ' WHERE 1 ',
        ''.join(
            f" AND institution ='{institution}' " for institution in institutions),
        ''.join(
            f" AND department ='{department}' " for department in departments),
        " ) ",
        "AND INSTR(plan_no, 'E') > 0 ",
        "AND s_id !='' ",
        "GROUP BY PI,s_id ",
        "ORDER BY COUNT(PI) DESC ",
    )
    sql = (
        "SELECT p.PI,COUNT(p.PI),p.s_id,s.institution,s.department,s.position,s.email,s.telephone ",
        "FROM all_project_info AS p,scholar_info AS s ",
        "WHERE ",
        ''.join(
            f"(p.KEYWORD_C LIKE '%{keyword}%' OR p.Pabstract_ch LIKE '%{keyword}%' OR p.PNCH_DESC LIKE '%{keyword}%') AND " for keyword in keywords),
        "( p.PLAN_ORGAN_CODE='科技部' OR p.PLAN_ORGAN_CODE='行政院國家科學委員會') ",
        "AND p.PI IN (SELECT name FROM scholar_info ",
        ' WHERE 1 ',
        ''.join(
            f" AND institution ='{institution}' " for institution in institutions),
        ''.join(
            f" AND department ='{department}' " for department in departments),
        " ) ",
        "AND INSTR(p.plan_no, 'E') > 0 ",
        "AND p.s_id =s.s_id ",
        "AND p.s_id !='' ",
        "GROUP BY p.PI,p.s_id ",
        "ORDER BY COUNT(PI) DESC ",
    )

    print(sql)
    sql = ''.join(sql)
    print('old sql:', sql)
    sql.format(keyword)
    print('new sql:', sql)
    result = exec_sql(sql)
    data = {
        "scholars": []
    }

    for item in result:
        scholar = {
            "scholar_name": item[0],
            "scholar_project_count": item[1],
            "scholar_s_id": item[2],
            "scholar_institution": item[3],
            "scholar_department": item[4],
            "scholar_position": item[5],
            "scholar_email": item[6],
            "scholar_phone": item[7],

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
    result = exec_sql(sql)
    data = {
        "projects": []
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


@api_view()
def get_school_data(request):
    sql = (
        "SELECT DISTINCT institution "
        "FROM scholar_info "
    )
    result_school = exec_sql(sql)
    sql = (
        "SELECT DISTINCT department "
        "FROM scholar_info "
    )
    result_department = exec_sql(sql)
    data = {
        "institution": [],
        "department": []
    }
    for item in result_school:
        data.get("institution").append(item[0])
    for item in result_department:
        data.get("department").append(item[0])

    return Response(data)


@api_view(['POST'])
def get_scholar_detail(request):
    print(request.data)
    if request.data['selected_s_id']:
        test = request.data['selected_s_id']
        print('test:', test)
    s_id = tuple(test)
    i = s_id[0]
    scholar_temp = []
    project_temp = []
    scholar = []
    test = {}

    sql = (
        "SELECT s_id,name,institution,department,position,email "
        "FROM scholar_info "
        f"WHERE s_id IN {s_id};"
    )
    scholar_info = exec_sql(sql)
    # print("scholar_info=",scholar_info)

    sql = (
        "SELECT a.s_id,a.PNCH_DESC,a.PLAN_YEAR,a.PLAN_AMT "
        "FROM ( "
        "SELECT ROW_NUMBER() "
        "over (PARTITION by b.s_id ORDER BY b.PLAN_YEAR DESC) "
        "as row_num, b.* "
        "FROM all_project_info as b "
        f"WHERE b.s_id IN {s_id} "
        ") a "
        "WHERE a.row_num<=2;"
    )

    project_info = exec_sql(sql)

    # for scholar_item in scholar_info:
    #     test[scholar_item[0]] = {
    #         'info': {
    #             "s_id": scholar_item[0],
    #             "institution": scholar_item[1],
    #             "department": scholar_item[2],
    #             "position": scholar_item[3],
    #             "mail": scholar_item[4]
    #         },
    #         'projects': []
    #     }
    # for project_item in project_info:
    #     test[project_item[0]]['projects'].append({
    #         "s_id": project_item[0],
    #         "project_name": project_item[1],
    #         "PLAN_YEAR": project_item[2],
    #         "PLAN_AMT": project_item[3]
    #     })
    for scholar_item in scholar_info:
        data = {
            "scholar_info": {
                "s_id": scholar_item[0],
                "name": scholar_item[1],
                "institution": scholar_item[2],
                "department": scholar_item[3],
                "position": scholar_item[4],
                "mail": scholar_item[5]
            },
            "project_info": []
        }
        for project_item in project_info:
            if scholar_item[0] == project_item[0]:
                project_temp = {
                    "s_id": project_item[0],
                    "project_name": project_item[1],
                    "PLAN_YEAR": project_item[2],
                    "PLAN_AMT": project_item[3]
                }
                data.get("project_info").append(project_temp)
        scholar.append(data)

    print("scholar=", scholar)

    return Response(scholar)
    # return Response(test)
