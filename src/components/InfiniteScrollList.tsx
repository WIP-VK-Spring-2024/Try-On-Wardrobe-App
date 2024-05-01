import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, FlatListProps, StyleSheetProperties } from "react-native";
import { ajax } from "../requests/common";
import { getLast } from "../utils";
import { RefreshControl } from "@gluestack-ui/themed";
import { useFocusEffect } from "@react-navigation/native";

export type FetchDataType<T> = (limit: number, since: string) => Promise<T[]>

interface InfiniteScrollListProps<T> extends Omit<FlatListProps<T>, 'data'> {
  data: T[]
  setData: (data: T[])=>void
  fetchData: FetchDataType<T>
}

export const InfiniteScrollList = observer(
<T extends {created_at: string}>(props: InfiniteScrollListProps<T>) => {
    // const [data, setData] = useState<T[]>([]);
    
    const limit = 9;
    const [since, setSince] = useState((new Date()).toISOString());

    const [isFirstPageReceived, setFirstPageRecieved] = useState(false);
    const [isLastPageReceived, setLastPageReceived] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const fetchData = () => {
      return props.fetchData(limit, since)
        .then(recieved => {
          if (recieved.length > 0) {
            setSince(getLast(recieved).created_at);
          } else {
            setLastPageReceived(true);
          }

          props.setData([...props.data, ...recieved]);
        })
        .catch(reason => {
          console.error(reason);
        })
    }

    
    const fetchNextPage = () => {
      if (!isLastPageReceived) {
        fetchData();
      }
    }

    const fetchFirstPage = () => {
      return fetchData()
        .then(() => {
          setFirstPageRecieved(true);
          return true;
        })
        .catch(reason => {
          console.error(reason);
          return false;
        })
    }
    
    const onRefresh = React.useCallback(() => {
      setRefreshing(true);

      setSince((new Date()).toISOString());
      props.setData([]);
      setFirstPageRecieved(false);
      setLastPageReceived(false);

      fetchFirstPage().then(() => {
        setRefreshing(false);
      })
    }, [])

    useEffect(() => {
      fetchFirstPage();
    }, []);


  const ListEndLoader = () => {
    if (!isLastPageReceived && isLoading) {
      return <ActivityIndicator size={'large'} />;
    }
  };

    return (
      <FlatList
        {...props}
      
        data={props.data}

        onEndReached={fetchNextPage}
        onEndReachedThreshold={0.8}
        ListFooterComponent={ListEndLoader}

        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    )
})
