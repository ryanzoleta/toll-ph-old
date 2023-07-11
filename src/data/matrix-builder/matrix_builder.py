import csv
import json
import os

matrix = {}


for filename in os.listdir(os.getcwd()):
    if filename.endswith('.csv'):

        matrix_arr = []

        tollway = filename.replace('.csv', '')
        matrix[tollway] = {}

        with open(filename) as csv_file:
            csv_reader = csv.reader(csv_file, delimiter=',')
            
            for row in csv_reader:
                matrix_arr.append(row)


        x = 1
        for x_axis in matrix_arr[0][1:]:
            matrix[tollway][x_axis] = {}
            y = 1
            for y_axis in matrix_arr[1:]:
                if matrix_arr[y][x].strip() != '':
                    matrix[tollway][x_axis][y_axis[0]] = int(matrix_arr[y][x])
                y += 1
            
            x += 1

        y = 1
        for y_axis in [yp[0] for yp in matrix_arr[1:]]:
            if y_axis not in matrix[tollway].keys():
                matrix[tollway][y_axis] = {}
            x = 1
            for x_axis in matrix_arr[0][1:]:
                if matrix_arr[y][x].strip() != '':
                    matrix[tollway][y_axis][x_axis] = int(matrix_arr[y][x])
                x += 1
            
            y += 1
        

with open('matrix.json', 'w', encoding='utf-8') as matrix_json:
    json.dump(matrix, matrix_json)
