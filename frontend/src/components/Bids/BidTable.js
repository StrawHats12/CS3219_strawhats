import React, {Component, useEffect, useState, useMemo} from "react";
import {useTable} from 'react-table';
import { getCurrentUser } from "../../hooks/useAuth";
import { getListingBids } from "../../services/bidding-service";

const BidTable = ({value}) => {
    const listingId = value.id;
    const currentUser = getCurrentUser();
    const [bids, setBids] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect( () => {
        getListingBids(listingId).then((res) => {
            if (!res) {
                setIsLoading(false);
                return;
            }
            setBids(res);
            setIsLoading(false);
        });
    }, []);

    // const data = useMemo( () => bids, []);
    // // filter away listingId, auctionId
    // const columns = useMemo( 
    //     () => [{
    //         Header: "Bid Id",
    //         accessor: "Bid Id"
    //     },
    //     {
    //         Header: "Bid Owner",
    //         // dataField: "username",
    //         accessor: "Bid Owner"
    //     },
    //     {
    //         Header: "Price",
    //         accessor: "Price"
    //         // dataField: "price",
    //     },
    //     {
    //         Header: "Date Of Bid",
    //         accessor: "Date Of Bid"
    //     },
    //     {
    //         Header: "Status",
    //         accessor: "Status"
    //     }
    //     ], []);
    
    // const {
    //     getTableProps,
    //     getTableBodyProps,
    //     headerGroups,
    //     rows,
    //     prepareRow
    //     } = useTable({ columns, data });

    return <div>
        
    </div>  
}

export default BidTable;