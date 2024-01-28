import pandas as pd
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from sklearn.preprocessing import MinMaxScaler
from sklearn.preprocessing import LabelEncoder

dataset = pd.read_csv('maindataset.csv')
print('Missing data')
for col in dataset.columns:
    print(str(col)+' has '+str((dataset[col].isna().sum()/len(dataset[col]))*100)+'%')

y=dataset['Heart Attack'].copy()
del dataset['Heart Attack']
le = LabelEncoder()
label = le.fit_transform(dataset['Sex'])
dataset['Sex']=label
le = LabelEncoder()
label = le.fit_transform(dataset['Diet'])
dataset['Diet']=label
dataset['Blood Pressure']=[(int(dataset['Blood Pressure'][i].split('/')[0])/int(dataset['Blood Pressure'][i].split('/')[1])) for i in range(len(dataset['Blood Pressure']))]

mod=MinMaxScaler()
mod.fit_transform(dataset)
print(len(dataset.columns))

model = Sequential()
model.add(Dense(22, input_shape=(19,), activation='relu'))
model.add(Dense(8, activation='relu'))
model.add(Dense(1, activation='sigmoid'))

model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])

model.fit(model, y, epochs=150, batch_size=10)


import pickle

saved = "mymodel.pkl"  

with open(saved, 'wb') as file:  
    pickle.dump(model, file)