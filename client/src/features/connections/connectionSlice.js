import {createSlice} from '@reduxjs/toolkit'
const initialState={
connection:[],
pendingConnection:[],
followers:[],
following:[],
}

const connectionsSlice=createSlice({
  name:'connections',
  initialState,
  reducers:{

  }
})

export default connectionsSlice.reducer