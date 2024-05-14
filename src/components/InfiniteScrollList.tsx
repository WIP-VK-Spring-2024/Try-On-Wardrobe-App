import { observer } from "mobx-react-lite";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { ActivityIndicator, FlatList, FlatListProps } from "react-native";
import { getLast } from "../utils";
import { RefreshControl, ScrollView } from "@gluestack-ui/themed";
import { RobotoText } from "./common";
import { useFocusEffect } from "@react-navigation/native";

export type FetchDataType<T> = (limit: number, since: string) => Promise<T[]>

interface InfiniteScrollListProps<T> extends Omit<FlatListProps<T>, 'data'> {
  data: T[]
  setData: (data: T[])=>void
  fetchData: FetchDataType<T>
  noItemsText?: string
  retryInterval?: number
}

export const InfiniteScrollList = observer(
<T extends {created_at: string}>(props: InfiniteScrollListProps<T>) => {
  const limit = 9;
  const [since, setSince] = useState((new Date()).toISOString());

  const [isLastPageReceived, setLastPageReceived] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const intervalHandle = useRef<NodeJS.Timeout>();

  const clearRetryInterval = useCallback(() => {
      if (intervalHandle.current) {
        clearInterval(intervalHandle.current);
        intervalHandle.current = undefined;
      }
  }, [intervalHandle]);

  const manageRetry = useCallback(() => {
    if (intervalHandle.current === undefined) {
      intervalHandle.current = setInterval(fetchData, props.retryInterval)
    }
    return clearRetryInterval;
  }, [intervalHandle]);

  useEffect(() => {
    if (!props.retryInterval) {
      fetchData();
    } else {
      return manageRetry();
    }
  }, []);

  useFocusEffect(() => {
    if (props.retryInterval) {
      return manageRetry();
    }
  });

  const fetchData = () => {
      return props.fetchData(limit, since)
        .then(recieved => {
          if (recieved.length > 0) {
            setSince(getLast(recieved).created_at);
            clearRetryInterval();
          } else {
            props.retryInterval
              ? intervalHandle.current === undefined &&
                (intervalHandle.current = setInterval(fetchData, props.retryInterval))
              : setLastPageReceived(true);
            return;
          }

          props.setData([...props.data, ...recieved]);
        })
        .catch(reason => {
          console.error(reason);
        })
  };

  
  const fetchNextPage = () => {
    if (!isLastPageReceived) {
      fetchData();
    }
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    setSince((new Date()).toISOString());
    props.setData([]);
    setLastPageReceived(false);

    fetchData().then(() => {
      setRefreshing(false);
    })
  }, [])

  const ListEndLoader = () => {
    if (!isLastPageReceived && isLoading) {
      return <ActivityIndicator size={'large'} />;
    }
  };

  return !isLastPageReceived || props.data.length > 0 ? (
    <FlatList
      {...props}
      data={props.data}
      onEndReached={fetchNextPage}
      onEndReachedThreshold={0.8}
      ListFooterComponent={ListEndLoader}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  ) : (
    <ScrollView h="100%" marginTop={10} contentContainerStyle={{justifyContent: "center"}}>
      <RobotoText fontSize={22} textAlign="center">
        {props.noItemsText || 'Ничего не найдено'}
      </RobotoText>
    </ScrollView>
  );
})
