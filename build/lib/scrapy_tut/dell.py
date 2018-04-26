

def solution1(N):
    # write your code in Python 3.6
    string = str(N)
    arr = list(string)
    arr = map(int, arr)
    quick_sort(arr, 0, len(arr)-1)
    arr = map(str, arr)
    sol = ""
    for x in arr:
        sol = x + sol
    sol = int (sol)
    return sol

def swap(arr, left, right):
    if(arr[left] != arr[right]):
        arr[left] = arr[left] + arr[right]
        arr[right] = arr[left] - arr[right]
        arr[left] = arr[left] - arr[right]


def partition(arr, left, right, pivot):
    i = (left-1)
    for j in range(left, right):
        if arr[j] <= pivot:
            i = i+1
            swap(arr, i, j)
            # arr[i], arr[j] = arr[j], arr[i]
    
    arr[i+1], arr[right] = arr[right], arr[i+1]
    return (i+1)

def quick_sort(arr, left, right):
    if left < right:
        pivot = arr[right]
        pirvot_index = partition(arr, left, right, pivot)
        quick_sort(arr, left, pirvot_index-1)
        quick_sort(arr, pirvot_index+1, right)


# print solution1(213)

# you can write to stdout for debugging purposes, e.g.
# print("this is a debug message")

def is_seq(arr, i, j):
    return (arr[j-1] - arr[i]) <= 1

def right_seq(A):
    min_index = 0
    flag = False
    for x in A:
        min_index += 1
        if is_seq(A, min_index, len(A)):
            flag = True
            if min_index == len(A) - 1:
                return 0
            break
        else:
            continue
    
    return len(A) - min_index if flag else 0

def left_seq(A):
    max_index = len(A)
    for i in range(0, len(A)):
        max_index -= 1
        if is_seq(A, 0, max_index):
            break
        else:
            continue
    if max_index < 2:
        return 0
    else:
        return max_index + 1

def left_right_seq(A):
    max_index = len(A)
    min_index = 0
    flag = False
    for i in range(0, len(A)):
        if min_index < max_index:
            max_index -= 1
            min_index += 1

            if is_seq(A, min_index, max_index):
                flag = True
                break
            else:
                continue
    return max_index - min_index if flag else 0


def solution(A):
    # write your code in Python 3.6
    quick_sort(A, 0, len(A)-1)
    print A
    # for i in range(0, len)
    return max([left_seq(A), right_seq(A), left_right_seq(A)])
    

print solution([10, 6, 6, 7, 9, 8])
print solution([1, 5, 7, 10, 11])
print solution([1, 5, 7, 9, 11])
# print "left: ", left_seq([1, 5, 7, 9, 11])
# print "right: ", right_seq([1, 5, 7, 9, 11])
print solution([1, 8, 7, 8, 8, 20])
